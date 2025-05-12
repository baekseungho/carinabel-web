import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import ProductView from "@/views/ProductView.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import Greeting from "@/views/GreetingView.vue";
import Story from "@/views/StoryView.vue";

const routes = [
    { path: "/", name: "Home", component: HomeView },
    {
        path: "/products",
        name: "Products",
        component: ProductView,
    },
    {
        path: "/products/:id",
        name: "ProductDetail",
        component: ProductDetail,
    },
    { path: "/about/greeting", name: "Greeting", component: Greeting },
    { path: "/about/story", name: "Story", component: Story },
    { path: "/about", name: "About", component: AboutView },
    { path: "/contact", name: "Contact", component: ContactView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
