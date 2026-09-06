import axios from "axios";

// Axios base configuration pointing to Backend API
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Access Token to headers
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto refresh access token on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // If refresh token does not exist
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Refresh access token
        const { data } = await axios.post(
          "/api/v1/auth/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        // Save new access token
        localStorage.setItem("accessToken", data.access);

        // Attach new token to original request
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid/expired
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;