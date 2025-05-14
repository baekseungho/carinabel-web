import { createStore } from "vuex";
import AuthService from "@/api/AuthService";

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
        async fetchUserProfile({ commit }) {
            try {
                const token = localStorage.getItem("token");
                const response = await AuthService.getUserProfile(token);

                // 🔄 업데이트된 user 정보 저장
                commit("setUser", response.data);
            } catch (error) {
                console.error("사용자 정보 불러오기 실패:", error);
                commit("clearUser");
            }
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        userName: (state) => (state.user ? state.user.fullName : ""),
        membershipLevel: (state) => (state.user ? state.user.membershipLevel : "일반회원"),
    },
});

export default store;
