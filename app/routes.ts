import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/note/:id", "routes/note.tsx"),
	route("/tag/:id", "routes/tag.tsx"),
	route("/api/query", "routes/api/query.ts"),
	route("/api/mutate", "routes/api/mutate.ts"),
] satisfies RouteConfig;
