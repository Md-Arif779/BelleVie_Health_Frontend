import api from "./api";

export const getInsuranceClaims = async (params = {}) => {
  const response = await api.get("/insurance/claims/", {
    params,
  });
  return response.data;
};

export const getInsuranceClaim = async (id) => {
  const response = await api.get(
    `/insurance/claims/${id}/`
  );
  return response.data;
};

export const createInsuranceClaim = async (data) => {
  const response = await api.post(
    "/insurance/claims/",
    data
  );
  return response.data;
};

export const updateInsuranceClaim = async (id, data) => {
  const response = await api.put(
    `/insurance/claims/${id}/`,
    data
  );
  return response.data;
};

export const patchInsuranceClaim = async (id, data) => {
  const response = await api.patch(
    `/insurance/claims/${id}/`,
    data
  );
  return response.data;
};

export const deleteInsuranceClaim = async (id) => {
  const response = await api.delete(
    `/insurance/claims/${id}/`
  );
  return response.data;
};