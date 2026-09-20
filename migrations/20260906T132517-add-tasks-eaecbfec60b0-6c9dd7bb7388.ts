import { col, schema as s } from "jazz-tools";

export default s.defineMigration({
	createTables: {
		"tasks": true,
	},
	migrate: {
		"notes": {
			taskIds: col.add.array({
				of: s.ref("tasks"),
				default: [],
			}),
		},
	},
	fromHash: "eaecbfec60b0",
	toHash: "6c9dd7bb7388",
	from: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
			"tagIds": s.array(s.ref("tags")),
			"projectIds": s.array(s.ref("projects")),
		})
	},
	to: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
			"tagIds": s.array(s.ref("tags")),
			"taskIds": s.array(s.ref("tasks")),
			"projectIds": s.array(s.ref("projects")),
		}),
		"tasks": s.table({
			"title": s.string(),
			"completed": s.boolean(),
			"dueDate": s.timestamp(),
		})
	},
});
