import api from "./api";

// Get all members
export const getMembers = async (params = {}) => {
  const response = await api.get("/members/", {
    params,
  });

  return response.data;
};

// Get single member
export const getMember = async (id) => {
  const response = await api.get(`/members/${id}/`);

  return response.data;
};

// Create member
export const createMember = async (data) => {
  const response = await api.post("/members/", data);

  return response.data;
};

// Update member
export const updateMember = async (id, data) => {
  const response = await api.put(`/members/${id}/`, data);

  return response.data;
};

// Partial update member
export const patchMember = async (id, data) => {
  const response = await api.patch(`/members/${id}/`, data);

  return response.data;
};

// Delete member
export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}/`);

  return response.data;
};