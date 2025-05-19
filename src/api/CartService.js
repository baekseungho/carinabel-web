import axios from "./axios";

const API_URL_CART = "/cart";

class CartService {
  getCartList(token) {
    return axios.get(`${API_URL_CART}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  addToCart(productId, token) {
    return axios.post(
      `${API_URL_CART}/add`,
      {
        productId: productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  updateCart(productId, quantity, token) {
    return axios.put(
      `${API_URL_CART}/update/${productId}`,
      {
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  deleteCartItem(itemId, token) {
    return axios.delete(
      `${API_URL_CART}/remove/${itemId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new CartService();
