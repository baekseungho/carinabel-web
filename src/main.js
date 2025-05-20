import "./styles/styleModule.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

createApp(App).use(router).use(store).mount("#app");
