import api from "./api";

export const getInsurancePolicies = async (params = {}) => {
  const response = await api.get("/insurance/policies/", {
    params,
  });

  return response.data;
};

export const getInsurancePolicy = async (id) => {
  const response = await api.get(
    `/insurance/policies/${id}/`
  );

  return response.data;
};

export const createInsurancePolicy = async (data) => {
  const response = await api.post(
    "/insurance/policies/",
    data
  );

  return response.data;
};

export const updateInsurancePolicy = async (id, data) => {
  const response = await api.put(
    `/insurance/policies/${id}/`,
    data
  );

  return response.data;
};

export const patchInsurancePolicy = async (id, data) => {
  const response = await api.patch(
    `/insurance/policies/${id}/`,
    data
  );

  return response.data;
};

export const deleteInsurancePolicy = async (id) => {
  const response = await api.delete(
    `/insurance/policies/${id}/`
  );

  return response.data;
};