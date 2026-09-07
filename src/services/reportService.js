import api from "./api";

/* =========================================================
   REPORT OVERVIEW
========================================================= */

export const getReportOverview = async () => {
  const response = await api.get("/reports/overview/");
  return response.data;
};

/* =========================================================
   MEMBER REPORT
========================================================= */

export const getMemberReport = async (params = {}) => {
  const response = await api.get("/reports/members/", {
    params,
  });

  return response.data;
};

/* =========================================================
   PROVIDER REPORT
========================================================= */

export const getProviderReport = async () => {
  const response = await api.get("/reports/providers/");
  return response.data;
};

/* =========================================================
   BILLING REPORT
========================================================= */

export const getBillingReport = async () => {
  const response = await api.get("/reports/billing/");
  return response.data;
};

/* =========================================================
   INSURANCE REPORT
========================================================= */

export const getInsuranceReport = async () => {
  const response = await api.get("/reports/insurance/");
  return response.data;
};

/* =========================================================
   SERVICE REPORT
========================================================= */

export const getServiceReport = async () => {
  const response = await api.get("/reports/services/");
  return response.data;
};