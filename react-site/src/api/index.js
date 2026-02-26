import axios from "axios";
const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});
export const api = {
    createProduct: async (product) => {
        let response = await apiClient.post("/goods", product);
        return response.data;
    },
    getProducts: async () => {
        let response = await apiClient.get("/goods");
        return response.data;
    },
    getProductById: async (id) => {
        let response = await apiClient.get(`/goods/${id}`);
        return response.data;
    },
    updateProduct: async (id, product) => {
        let response = await apiClient.put(`/goods/${id}`, product);
        return response.data;
    },
    deleteProduct: async (id) => {
        let response = await apiClient.delete(`/goods/${id}`);
        return response.data;
    },
};
