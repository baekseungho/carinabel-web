import { createStore } from "vuex";

const store = createStore({
    state: {
        products: [],
        cart: [],
    },
    mutations: {
        setProducts(state, products) {
            state.products = products;
        },
        addToCart(state, product) {
            state.cart.push(product);
        },
        removeFromCart(state, productId) {
            state.cart = state.cart.filter((item) => item.id !== productId);
        },
    },
    actions: {
        fetchProducts({ commit }) {
            // 예시 - 실제 API로 교체 필요
            const sampleProducts = [
                { id: 1, name: "Lavender Oil", price: 25, image: "/assets/lavender.jpg" },
                { id: 2, name: "Peppermint Oil", price: 20, image: "/assets/peppermint.jpg" },
            ];
            commit("setProducts", sampleProducts);
        },
    },
    getters: {
        products: (state) => state.products,
        cart: (state) => state.cart,
    },
});

export default store;
