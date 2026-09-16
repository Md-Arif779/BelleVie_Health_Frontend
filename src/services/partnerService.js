
import api from "./api";

export const getPartners = async (params = {}) => {
  const response = await api.get("/partners/", {
    params,
  });

  return response.data;
};


export const getPartner = async (id) => {
  const response = await api.get(
    `/partners/${id}/`
  );

  return response.data;
};

