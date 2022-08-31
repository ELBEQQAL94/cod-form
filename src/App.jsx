// LIbraries
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";

// Views
import { Home } from "./views";

// CSS
import "@shopify/polaris/build/esm/styles.css";
import "./app.css";

const App = () => {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location.href).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <Home />
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      headers: {
        "Content-Type": "application/graphql",
      },
      fetch: authenticatedFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export async function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

export default App;
