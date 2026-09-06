import api from "./api";

// Get all appointments
export const getAppointments = async (params = {}) => {
  const response = await api.get("/services/appointments/", {
    params,
  });

  return response.data;
};

// Get single appointment
export const getAppointment = async (id) => {
  const response = await api.get(`/services/appointments/${id}/`);

  return response.data;
};

// Create appointment
export const createAppointment = async (data) => {
  const response = await api.post(
    "/services/appointments/",
    data
  );

  return response.data;
};

// Update appointment
export const updateAppointment = async (id, data) => {
  const response = await api.put(
    `/services/appointments/${id}/`,
    data
  );

  return response.data;
};

// Partial update appointment
export const patchAppointment = async (id, data) => {
  const response = await api.patch(
    `/services/appointments/${id}/`,
    data
  );

  return response.data;
};

// Delete appointment
export const deleteAppointment = async (id) => {
  const response = await api.delete(
    `/services/appointments/${id}/`
  );

  return response.data;
};