import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
	index('./routes/_index.tsx'),
	route('/note/:id', './routes/note.$id.tsx'),
	route('/tag/*', './routes/tag.$.tsx'),
	route('/tags/search', './routes/tags.search.ts'),
] satisfies RouteConfig
