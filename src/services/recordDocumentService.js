import api from "./api";

// Get all record documents
export const getRecordDocuments = async (params = {}) => {
  const response = await api.get("/health/documents/", {
    params,
  });

  return response.data;
};

// Get single record document
export const getRecordDocument = async (id) => {
  const response = await api.get(`/health/documents/${id}/`);

  return response.data;
};

// Create record document
export const createRecordDocument = async (data) => {
  const response = await api.post(
    "/health/documents/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update record document
export const updateRecordDocument = async (id, data) => {
  const response = await api.put(
    `/health/documents/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Partial update
export const patchRecordDocument = async (id, data) => {
  const response = await api.patch(
    `/health/documents/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete record document
export const deleteRecordDocument = async (id) => {
  const response = await api.delete(
    `/health/documents/${id}/`
  );

  return response.data;
};