import axios from "axios";

const getUserIdApi = async (shopName) => {
  const response = await axios.get(
    `${import.meta.env.VITE_HOST}/api/v1/users/${shopName}`
  );
  return response;
};

export const userApi = {
  getUserIdApi,
};
