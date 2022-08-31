const Field = ({ field, provided, snapshot }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="field-container"
    style={{ ...provided.draggableProps.style }}
  >
    {field.label}
  </div>
);

export default Field;
