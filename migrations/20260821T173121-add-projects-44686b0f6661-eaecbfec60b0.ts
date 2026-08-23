import { col, schema as s } from "jazz-tools";

export default s.defineMigration({
	createTables: {
		"projects": true,
	},
	migrate: {
		"notes": {
			projectIds: col.add.array({
				of: s.ref("projects"),
				default: []
			})
		},
	},
	fromHash: "44686b0f6661",
	toHash: "eaecbfec60b0",
	from: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
			"tagIds": s.array(s.ref("tags")),
		})
	},
	to: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
			"tagIds": s.array(s.ref("tags")),
			"projectIds": s.array(s.ref("projects")),
		}),
		"projects": s.table({
			"title": s.string(),
			"tagIds": s.array(s.ref("tags")),
		})
	},
});
