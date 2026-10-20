import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [tailwindcss(), reactRouter()],
	build: {
		rollupOptions: isSsrBuild
			? { input: "./server/app.ts" }
			: undefined,
	},
	resolve: {
		tsconfigPaths: true,
	},
}))
