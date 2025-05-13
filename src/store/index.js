import { createStore } from "vuex";

const store = createStore({
    state: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
    },
    mutations: {
        setUser(state, userData) {
            state.user = userData;
            state.token = userData.token;
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", userData.token);
        },
        clearUser(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    actions: {
        login({ commit }, userData) {
            commit("setUser", userData);
        },
        logout({ commit }) {
            commit("clearUser");
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
        userName: (state) => (state.user ? state.user.fullName : ""),
    },
});

export default store;
