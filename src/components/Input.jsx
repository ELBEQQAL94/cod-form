// Components
import FieldIcon from "./FieldIcon";

const Input = ({ field }) => {
  return (
    <>
      <label className="input-label" htmlFor={field.placeholder}>
        {field.label}
      </label>
      <div className="input-container">
        <FieldIcon label={field.label} />
        <input
          id={field.placeholder}
          type={field.type}
          placeholder={field.placeholder}
        />
      </div>
    </>
  );
};

export default Input;
