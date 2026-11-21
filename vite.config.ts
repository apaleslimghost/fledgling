import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
	plugins: [tailwindcss(), reactRouter()],
	environments: {
		ssr: {
			build: {
				rollupOptions: {
					input: "./app/server.ts",
				},
			},
		},
	},
	resolve: {
		tsconfigPaths: true,
	},
}))
