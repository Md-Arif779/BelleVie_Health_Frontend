import api from "./api";

// Get all users
export const getUsers = async () => {
  const response = await api.get("/auth/users/");
  return response.data;
};

// Get single user with permissions
export const getUser = async (id) => {
  const response = await api.get(`/auth/users/${id}/`);
  return response.data;
};

// Create user with permissions
export const createUser = async (data) => {
  const response = await api.post("/auth/users/create/", data);
  return response.data;
};

// Update user + permissions
export const updateUser = async (id, data) => {
  const response = await api.patch(`/auth/users/${id}/`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/auth/users/${id}/`);
  return response.data;
};