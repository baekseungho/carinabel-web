import axios from "./axios";

const API_URL_PRODUCT = "/products";
const API_URL_KIT = "/kits";

class ProductService {
    getProducts(token) {
        return axios.get(`${API_URL_PRODUCT}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getProduct(id, token) {
        return axios.get(`${API_URL_PRODUCT}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getKits(token) {
        return axios.get(`${API_URL_KIT}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    getKit(id, token) {
        return axios.get(`${API_URL_KIT}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new ProductService();
