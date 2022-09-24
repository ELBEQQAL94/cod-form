// Libraries
import { Icon } from "@shopify/polaris";
import { ComposeMajor } from "@shopify/polaris-icons";

// Components
import FieldIcon from "./FieldIcon";

const Field = ({ field, provided, snapshot }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="field-container"
    style={{ ...provided.draggableProps.style }}
  >
    <div className="field-container__label">
      <FieldIcon label={field.label} />
      <p>{field.label}</p>
    </div>
    <Icon source={ComposeMajor} color="highlight" />
  </div>
);

export default Field;
