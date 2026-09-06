import api from "./api";

// Get all diagnostic centers
export const getDiagnosticCenters = async (params = {}) => {
  const response = await api.get("/providers/diagnostics/", {
    params,
  });

  return response.data;
};

// Get single diagnostic center
export const getDiagnosticCenter = async (id) => {
  const response = await api.get(`/providers/diagnostics/${id}/`);

  return response.data;
};

// Create diagnostic center
export const createDiagnosticCenter = async (data) => {
  const response = await api.post(
    "/providers/diagnostics/",
    data
  );

  return response.data;
};

// Update diagnostic center
export const updateDiagnosticCenter = async (id, data) => {
  const response = await api.put(
    `/providers/diagnostics/${id}/`,
    data
  );

  return response.data;
};

// Partial update diagnostic center
export const patchDiagnosticCenter = async (id, data) => {
  const response = await api.patch(
    `/providers/diagnostics/${id}/`,
    data
  );

  return response.data;
};

// Delete diagnostic center
export const deleteDiagnosticCenter = async (id) => {
  const response = await api.delete(
    `/providers/diagnostics/${id}/`
  );

  return response.data;
};