// Libraries
import { useState, useEffect } from "react";
import { Page, Layout } from "@shopify/polaris";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { gql, useQuery } from "@apollo/client";

// Component
import { Field } from "../components";

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

  const fetchUserId = async () => {
    const response = await userApi.getUserIdApi(data.shop.myshopifyDomain);
    const userId = response.data.content.id;

    const fieldsResponse = await fieldsApi.getFieldsApi(userId);
    const fields = fieldsResponse.data.content;

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
                        style={{
                          background: "#e9ecef",
                          padding: 4,
                          width: "33.3333%",
                        }}
                      >
                        <h2>{column.name}</h2>
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
        <div
          style={{
            background: "lightgrey",
            padding: 4,
            width: "33.3333%",
          }}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            if (column.name === "Current Fields") {
              return (
                <div>
                  <h1>Preview</h1>
                  {column.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: 16,
                        margin: "0 0 8px 0",
                        minHeight: "50px",
                        backgroundColor: "#263B4A",
                        color: "white",
                      }}
                    >
                      {item.label}
                    </div>
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
