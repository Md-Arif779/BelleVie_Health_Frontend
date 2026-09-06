import api from "./api";

export const getLabResults = async (params = {}) => {
  const response = await api.get("/services/lab-results/", {
    params,
  });

  return response.data;
};

export const getLabResult = async (id) => {
  const response = await api.get(
    `/services/lab-results/${id}/`
  );

  return response.data;
};

export const createLabResult = async (data) => {
  const response = await api.post(
    "/services/lab-results/",
    data
  );

  return response.data;
};

export const updateLabResult = async (id, data) => {
  const response = await api.put(
    `/services/lab-results/${id}/`,
    data
  );

  return response.data;
};

export const patchLabResult = async (id, data) => {
  const response = await api.patch(
    `/services/lab-results/${id}/`,
    data
  );

  return response.data;
};

export const deleteLabResult = async (id) => {
  const response = await api.delete(
    `/services/lab-results/${id}/`
  );

  return response.data;
};