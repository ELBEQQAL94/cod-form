// Libraries
import { Icon } from "@shopify/polaris";
import { EditMajor } from "@shopify/polaris-icons";

const Field = ({ field, provided, snapshot }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="field-container"
    style={{ ...provided.draggableProps.style }}
  >
    <div className="field-container__label">
      <div>ICON</div>
      <p>{field.label}</p>
    </div>
    <Icon source={EditMajor} color="highlight" />
  </div>
);

export default Field;
