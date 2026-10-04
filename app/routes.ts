import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.ts"),
	route("/workspace/:workspaceId", "routes/workspace/_root.tsx", [
		index("routes/workspace/home.tsx"),
		route("note/:noteId/:taskId?", "routes/workspace/note.tsx"),
		route("tag/*", "routes/workspace/tag.tsx"),
		route("project/:projectId", "routes/workspace/project.tsx"),
	]),
] satisfies RouteConfig;
