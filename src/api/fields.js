import axios from "axios";

const getFieldsApi = async (userId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_HOST}/api/v1/fields/${userId}`
  );
  return response;
};

export const fieldsApi = {
  getFieldsApi,
};
