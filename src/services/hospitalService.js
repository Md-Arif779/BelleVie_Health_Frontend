import api from "./api";

// Get all hospitals
export const getHospitals = async (params = {}) => {
  const response = await api.get("/providers/hospitals/", {
    params,
  });

  return response.data;
};

// Get single hospital
export const getHospital = async (id) => {
  const response = await api.get(`/providers/hospitals/${id}/`);

  return response.data;
};

// Create hospital
export const createHospital = async (data) => {
  const response = await api.post("/providers/hospitals/", data);

  return response.data;
};

// Update hospital
export const updateHospital = async (id, data) => {
  const response = await api.put(
    `/providers/hospitals/${id}/`,
    data
  );

  return response.data;
};

// Partial update hospital
export const patchHospital = async (id, data) => {
  const response = await api.patch(
    `/providers/hospitals/${id}/`,
    data
  );

  return response.data;
};

// Delete hospital
export const deleteHospital = async (id) => {
  const response = await api.delete(
    `/providers/hospitals/${id}/`
  );

  return response.data;
};