import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			//實際引入
			component: HomeView,
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			//動態引入
			component: () => import("../views/AboutView.vue"),
		},
		{
			path: "/lifecycle",
			name: "lifecycle",
			//實際引入
			component: () => import("../views/LifeCycle.vue"),
		},
	],
});

export default router;
