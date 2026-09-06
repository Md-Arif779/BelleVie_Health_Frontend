import api from "./api";

// Get all pharmacies
export const getPharmacies = async (params = {}) => {
  const response = await api.get("/providers/pharmacies/", {
    params,
  });

  return response.data;
};

// Get single pharmacy
export const getPharmacy = async (id) => {
  const response = await api.get(`/providers/pharmacies/${id}/`);

  return response.data;
};

// Create pharmacy
export const createPharmacy = async (data) => {
  const response = await api.post(
    "/providers/pharmacies/",
    data
  );

  return response.data;
};

// Update pharmacy
export const updatePharmacy = async (id, data) => {
  const response = await api.put(
    `/providers/pharmacies/${id}/`,
    data
  );

  return response.data;
};

// Partial update pharmacy
export const patchPharmacy = async (id, data) => {
  const response = await api.patch(
    `/providers/pharmacies/${id}/`,
    data
  );

  return response.data;
};

// Delete pharmacy
export const deletePharmacy = async (id) => {
  const response = await api.delete(
    `/providers/pharmacies/${id}/`
  );

  return response.data;
};