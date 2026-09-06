import api from "./api";

// Get all medicine orders
export const getMedicineOrders = async (params = {}) => {
  const response = await api.get("/pharmacy/medicine-orders/", {
    params,
  });

  return response.data;
};

// Get single medicine order
export const getMedicineOrder = async (id) => {
  const response = await api.get(
    `/pharmacy/medicine-orders/${id}/`
  );

  return response.data;
};

// Create medicine order
export const createMedicineOrder = async (data) => {
  const response = await api.post(
    "/pharmacy/medicine-orders/",
    data
  );

  return response.data;
};

// Update medicine order
export const updateMedicineOrder = async (id, data) => {
  const response = await api.put(
    `/pharmacy/medicine-orders/${id}/`,
    data
  );

  return response.data;
};

// Partial update
export const patchMedicineOrder = async (id, data) => {
  const response = await api.patch(
    `/pharmacy/medicine-orders/${id}/`,
    data
  );

  return response.data;
};

// Delete medicine order
export const deleteMedicineOrder = async (id) => {
  const response = await api.delete(
    `/pharmacy/medicine-orders/${id}/`
  );

  return response.data;
};