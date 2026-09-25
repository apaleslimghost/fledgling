import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.ts"),
	route("/workspace/:workspaceId", "routes/workspace/_root.tsx", [
		index("routes/workspace/home.tsx"),
		route("note/:noteId", "routes/workspace/note.tsx"),
		route("tag/:tagId", "routes/workspace/tag.tsx"),
	]),
	route("/api/query", "routes/api/query.ts"),
	route("/api/mutate", "routes/api/mutate.ts"),
] satisfies RouteConfig;
