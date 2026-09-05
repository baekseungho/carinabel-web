import { createStore } from "vuex";
import AuthService from "@/api/AuthService";
import { getStoredToken, getStoredUser } from "@/utils/storage";

const store = createStore({
    state: {
        user: getStoredUser(),
        token: getStoredToken(),
    },
    mutations: {
        setUser(state, userData) {
            const token = userData?.token || state.token || getStoredToken();
            state.user = { ...(state.user || {}), ...(userData || {}), ...(token ? { token } : {}) };
            state.token = token;
            localStorage.setItem("user", JSON.stringify(state.user));
            if (token) localStorage.setItem("token", token);
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
                const token = getStoredToken();
                if (!token) throw new Error("인증 토큰이 없습니다.");
                const response = await AuthService.getUserProfile(token);

                // 🔄 업데이트된 user 정보 저장
                commit("setUser", response.data);
            } catch (error) {
                console.error("사용자 정보 불러오기 실패:", error);
                if ([401, 403].includes(error.response?.status)) commit("clearUser");
                throw error;
            }
        },
    },
    getters: {
        isAuthenticated: (state) => Boolean(state.token && state.user),
        userName: (state) => (state.user ? state.user.fullName : ""),
        membershipLevel: (state) => (state.user ? state.user.membershipLevel : "일반회원"),
    },
});

export default store;
