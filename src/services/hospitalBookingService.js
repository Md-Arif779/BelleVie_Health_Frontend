import api from "./api";

// Get all hospital bookings
export const getHospitalBookings = async (params = {}) => {
  const response = await api.get(
    "/services/hospital-bookings/",
    {
      params,
    }
  );

  return response.data;
};

// Get single hospital booking
export const getHospitalBooking = async (id) => {
  const response = await api.get(
    `/services/hospital-bookings/${id}/`
  );

  return response.data;
};

// Create hospital booking
export const createHospitalBooking = async (data) => {
  const response = await api.post(
    "/services/hospital-bookings/",
    data
  );

  return response.data;
};

// Update hospital booking
export const updateHospitalBooking = async (id, data) => {
  const response = await api.put(
    `/services/hospital-bookings/${id}/`,
    data
  );

  return response.data;
};

// Partial update hospital booking
export const patchHospitalBooking = async (id, data) => {
  const response = await api.patch(
    `/services/hospital-bookings/${id}/`,
    data
  );

  return response.data;
};

// Delete hospital booking
export const deleteHospitalBooking = async (id) => {
  const response = await api.delete(
    `/services/hospital-bookings/${id}/`
  );

  return response.data;
};