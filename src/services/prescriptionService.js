import api from "./api";

export const getPrescriptions = async (params = {}) => {
  const response = await api.get("/services/prescriptions/", {
    params,
  });

  return response.data;
};

export const getPrescription = async (id) => {
  const response = await api.get(
    `/services/prescriptions/${id}/`
  );

  return response.data;
};

export const createPrescription = async (data) => {
  const response = await api.post(
    "/services/prescriptions/",
    data
  );

  return response.data;
};

export const updatePrescription = async (id, data) => {
  const response = await api.put(
    `/services/prescriptions/${id}/`,
    data
  );

  return response.data;
};

export const patchPrescription = async (id, data) => {
  const response = await api.patch(
    `/services/prescriptions/${id}/`,
    data
  );

  return response.data;
};

export const deletePrescription = async (id) => {
  const response = await api.delete(
    `/services/prescriptions/${id}/`
  );

  return response.data;
};