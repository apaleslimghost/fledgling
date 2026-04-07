import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
	index('./routes/_index.tsx'),
	route('/note/:id', './routes/note.tsx'),
	route('/tag/*', './routes/tag.tsx'),
] satisfies RouteConfig
