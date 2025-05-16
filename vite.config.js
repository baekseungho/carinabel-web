import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접근 허용
        port: 5173, // 기본 포트 (필요시 변경 가능)
        open: true, // 서버 시작 시 브라우저 자동 열기 (선택)
        strictPort: true, // 포트 고정 (필요시 선택)
        cors: true, // CORS 허용 (필요시 선택)
    },
});
