// Libraries
import { useState, useEffect } from "react";
import { Page, Layout } from "@shopify/polaris";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { gql, useQuery } from "@apollo/client";
import { userLoggedInFetch } from "../App";
import { useAppBridge } from "@shopify/app-bridge-react";

// Component
import { Field, Input } from "../components";

// APIs
import { userApi, fieldsApi } from "../api";

// Create Query folder
const GET_SHOP_INFO = gql`
  query {
    shop {
      myshopifyDomain
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_SHOP_INFO);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  // const [shopifyFields, setShopifyFields] = useState([]);
  // const [currentFields, setCurrentFields] = useState([]);

  const columnsFromBackend = {};

  const [columns, setColumns] = useState(columnsFromBackend);

  // const shopifyFields = [
  //   { id: nanoid(), content: "Last Name" },
  //   { id: nanoid(), content: "Province" },
  //   { id: nanoid(), content: "Address 1" },
  //   { id: nanoid(), content: "Confirm Phone" },
  //   { id: nanoid(), content: "Email" },
  //   { id: nanoid(), content: "Zip" },
  //   { id: nanoid(), content: "Address 2" },
  // ];

  // const currentFields = [
  //   { id: nanoid(), content: "First Name" },
  //   { id: nanoid(), content: "Phone" },
  //   { id: nanoid(), content: "Note" },
  //   { id: nanoid(), content: "City" },
  //   { id: nanoid(), content: "Country" },
  // ];

  const fetchUserId = async () => {
    const shopName = data.shop.myshopifyDomain;
    const res = await fetch(`/api/v1/users/${shopName}`);
    const response = await res.json();
    // const response = await userApi.getUserIdApi(data.shop.myshopifyDomain);
    const userId = response.content.id;

    const fieldsResponse = await fetch(`/api/v1/fields/${userId}`);
    const { content } = await fieldsResponse.json();
    const fields = content;

    const shopifyFields = fields.shopifyFields;
    const currentFields = fields.currentFields[0].currentFieldsOnUsers.map(
      (field) => field.field
    );

    const columnsFromBackend = {
      [nanoid()]: {
        name: "Shopify Fields",
        items: shopifyFields,
      },
      [nanoid()]: {
        name: "Current Fields",
        items: currentFields,
      },
    };

    console.log("currentFields: ", currentFields);

    setColumns(columnsFromBackend);
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    if (!loading) fetchUserId();
  }, [loading]);

  return (
    <Page fullWidth>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).length > 0 &&
            Object.entries(columns).map(([columnId, column], index) => {
              return (
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="column-container"
                      >
                        <h2 className="column-title">{column.name}</h2>
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <Field
                                    field={item}
                                    provided={provided}
                                    snapshot={snapshot}
                                  />
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              );
            })}
        </DragDropContext>
        <div className="column-container">
          {Object.entries(columns).map(([columnId, column], index) => {
            if (column.name === "Current Fields") {
              return (
                <div>
                  <h1 className="column-title">Preview</h1>
                  {column.items.map((item) => (
                    <Input key={item.id} field={item} />
                  ))}
                </div>
              );
            }
          })}
        </div>
      </div>
    </Page>
  );
};

export default Home;
