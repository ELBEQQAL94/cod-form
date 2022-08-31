// Libraries
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// Middlewares
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";

// Routes
import fieldRouter from "./routes/fieldRoutes.js";
import userRouter from "./routes/userRoutes.js";

const prisma = new PrismaClient();

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";
const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  // Middlewares
  app.use(morgan("tiny"));
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  // Routers
  app.use("/api/v1/fields", fieldRouter);
  app.use("/api/v1/users", userRouter);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/api/v1/users", async (req, res, next) => {
    try {
      const shops = await prisma.user.findMany();
      return res.json(shops);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/v1/users", async (req, res, next) => {
    // AFTER CREATE USER
    // CREATE ALL FIELDS WITH OWNER ID
    // CREATE CURRENT FIELDS
    try {
      const user = await prisma.user.create({
        data: {
          shop: "shop",
          accessToken: "access token",
        },
      });
      return res.json({
        message: "user created!",
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/fields", async (req, res, next) => {
    try {
      const shops = await prisma.field.findMany({});
      return res.json(shops);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/current-fields", async (req, res) => {
    // NEED USER ID
    const { userId } = req.query;
    const test = await prisma.user.findMany({
      where: {
        id: userId,
      },
      include: {
        currentFieldsOnUsers: { include: { field: true } },
      },
    });
    // const getCurrentFields = await prisma.currentFieldsOnUsers.findMany({
    //   where: {
    //     userId
    //   }
    // });
    res.json(test);
  });

  app.get("/api/v1/rest-fields", async (req, res) => {
    const { userId } = req.query;
    const fields = await prisma.field.findMany({
      where: {
        userId,
      },
    });
    const currentFields = await prisma.currentFieldsOnUsers.findMany({
      where: {
        userId,
      },
    });
    const restFields = fields.filter(
      (field) =>
        !currentFields.find((currentField) => currentField.fieldId === field.id)
    );
    res.json(restFields);
  });

  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
