import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

const refreshClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

function getAccessToken() {
    return localStorage.getItem("accessToken");
}

function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

function setTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/auth/login")) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/auth/register")) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/auth/refresh")) {
            clearTokens();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
        }

        try {
            const refreshResponse = await refreshClient.post(
                "/auth/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                },
            );

            const { accessToken, refreshToken: nextRefreshToken } =
                refreshResponse.data;

            setTokens(accessToken, nextRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            clearTokens();
            return Promise.reject(refreshError);
        }
    },
);

export const api = {
    register: async (payload) => {
        const response = await apiClient.post("/auth/register", payload);
        return response.data;
    },

    login: async (payload) => {
        const response = await apiClient.post("/auth/login", payload);
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        return response.data;
    },

    refresh: async () => {
        const refreshToken = getRefreshToken();
        const response = await refreshClient.post(
            "/auth/refresh",
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );

        const { accessToken, refreshToken: nextRefreshToken } = response.data;
        setTokens(accessToken, nextRefreshToken);
        return response.data;
    },

    me: async () => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },

    logout: () => {
        clearTokens();
    },

    hasSession: () => {
        return Boolean(getAccessToken() && getRefreshToken());
    },

    createProduct: async (product) => {
        const response = await apiClient.post("/products", product);
        return response.data;
    },

    getProducts: async () => {
        const response = await apiClient.get("/products");
        return response.data;
    },

    getProductById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await apiClient.put(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },

    getUsers: async () => {
        const response = await apiClient.get("/users");
        return response.data;
    },

    getUserById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },

    updateUser: async (id, payload) => {
        const response = await apiClient.put(`/users/${id}`, payload);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },
};
