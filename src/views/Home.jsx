// Libraries
import { useState } from "react";
import { Page, Layout } from "@shopify/polaris";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";

const shopifyFields = [
  { id: nanoid(), content: "Last Name" },
  { id: nanoid(), content: "Province" },
  { id: nanoid(), content: "Address 1" },
  { id: nanoid(), content: "Confirm Phone" },
  { id: nanoid(), content: "Email" },
  { id: nanoid(), content: "Zip" },
  { id: nanoid(), content: "Address 2" },
];

const currentFields = [
  { id: nanoid(), content: "First Name" },
  { id: nanoid(), content: "Phone" },
  { id: nanoid(), content: "Note" },
  { id: nanoid(), content: "City" },
  { id: nanoid(), content: "Country" },
];

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

const Home = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <Page>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                    </div>
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
                </div>
              </div>
            );
          })}
        </DragDropContext>
        <div
          style={{
            background: "lightgrey",
            padding: 4,
            width: 250,
            minHeight: 500,
          }}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            if (column.name === "Current Fields") {
              return (
                <div>
                  <h1>Preview</h1>
                  {column.items.map((item) => (
                    <div
                      style={{
                        padding: 16,
                        margin: "0 0 8px 0",
                        minHeight: "50px",
                        backgroundColor: "#263B4A",
                        color: "white",
                      }}
                    >
                      {item.content}
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
