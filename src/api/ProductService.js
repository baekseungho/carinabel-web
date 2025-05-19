import axios from "./axios";

const API_URL_PRODUCT = "/products";

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
}

export default new ProductService();
