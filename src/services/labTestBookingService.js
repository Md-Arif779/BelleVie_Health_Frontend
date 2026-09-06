import api from "./api";

// Get all lab test bookings
export const getLabTestBookings = async (params = {}) => {
  const response = await api.get("/services/lab-test-bookings/", {
    params,
  });

  return response.data;
};

// Get single lab test booking
export const getLabTestBooking = async (id) => {
  const response = await api.get(
    `/services/lab-test-bookings/${id}/`
  );

  return response.data;
};

// Create lab test booking
export const createLabTestBooking = async (data) => {
  const response = await api.post(
    "/services/lab-test-bookings/",
    data
  );

  return response.data;
};

// Update lab test booking
export const updateLabTestBooking = async (id, data) => {
  const response = await api.put(
    `/services/lab-test-bookings/${id}/`,
    data
  );

  return response.data;
};

// Partial update
export const patchLabTestBooking = async (id, data) => {
  const response = await api.patch(
    `/services/lab-test-bookings/${id}/`,
    data
  );

  return response.data;
};

// Delete lab test booking
export const deleteLabTestBooking = async (id) => {
  const response = await api.delete(
    `/services/lab-test-bookings/${id}/`
  );

  return response.data;
};