import api from "./api";

/* =========================================================
   INVOICE APIs
========================================================= */

// Get all invoices
export const getInvoices = async () => {
  const response = await api.get("/services/invoices/");
  return response.data;
};

// Get single invoice
export const getInvoice = async (id) => {
  const response = await api.get(`/services/invoices/${id}/`);
  return response.data;
};

// Create invoice
export const createInvoice = async (data) => {
  const response = await api.post("/services/invoices/", data);
  return response.data;
};

// Update invoice
export const updateInvoice = async (id, data) => {
  const response = await api.put(`/services/invoices/${id}/`, data);
  return response.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const response = await api.delete(`/services/invoices/${id}/`);
  return response.data;
};


/* =========================================================
   PAYMENT APIs
========================================================= */

// Get all payments
export const getPayments = async () => {
  const response = await api.get("/services/payments/");
  return response.data;
};

// Get single payment
export const getPayment = async (id) => {
  const response = await api.get(`/services/payments/${id}/`);
  return response.data;
};

// Create payment
export const createPayment = async (data) => {
  const response = await api.post("/services/payments/", data);
  return response.data;
};

// Update payment
export const updatePayment = async (id, data) => {
  const response = await api.put(`/services/payments/${id}/`, data);
  return response.data;
};

// Delete payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/services/payments/${id}/`);
  return response.data;
};