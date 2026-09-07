import api from "./api";

// Get all medical tourism requests
export const getMedicalTourismRequests = async (params = {}) => {
  const response = await api.get(
    "/medical-tourism/requests/",
    { params }
  );

  return response.data;
};

// Get single medical tourism request
export const getMedicalTourismRequest = async (id) => {
  const response = await api.get(
    `/medical-tourism/requests/${id}/`
  );

  return response.data;
};

// Create medical tourism request
export const createMedicalTourismRequest = async (data) => {
  const response = await api.post(
    "/medical-tourism/requests/",
    data
  );

  return response.data;
};

// Update medical tourism request
export const updateMedicalTourismRequest = async (
  id,
  data
) => {
  const response = await api.put(
    `/medical-tourism/requests/${id}/`,
    data
  );

  return response.data;
};

// Delete medical tourism request
export const deleteMedicalTourismRequest = async (id) => {
  const response = await api.delete(
    `/medical-tourism/requests/${id}/`
  );

  return response.data;
};