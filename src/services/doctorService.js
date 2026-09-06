import api from "./api";

// Get all doctors
export const getDoctors = async (params = {}) => {
  const response = await api.get("/providers/doctors/", {
    params,
  });

  return response.data;
};

// Get single doctor
export const getDoctor = async (id) => {
  const response = await api.get(`/providers/doctors/${id}/`);

  return response.data;
};

// Create doctor
export const createDoctor = async (data) => {
  const response = await api.post("/providers/doctors/", data);

  return response.data;
};

// Update doctor
export const updateDoctor = async (id, data) => {
  const response = await api.put(`/providers/doctors/${id}/`, data);

  return response.data;
};

// Partial update doctor
export const patchDoctor = async (id, data) => {
  const response = await api.patch(`/providers/doctors/${id}/`, data);

  return response.data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
  const response = await api.delete(`/providers/doctors/${id}/`);

  return response.data;
};