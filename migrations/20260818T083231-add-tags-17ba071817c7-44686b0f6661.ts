import { col, schema as s } from "jazz-tools";

export default s.defineMigration({
	createTables: {
		"tags": true,
	},
	migrate: {
		"notes": {
			tagIds: col.add.array({
				of: s.ref("tags"),
				default: []
			})
		},
	},
	fromHash: "17ba071817c7",
	toHash: "44686b0f6661",
	from: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
		})
	},
	to: {
		"notes": s.table({
			"title": s.string(),
			"content": s.json(),
			"tagIds": s.array(s.ref("tags")),
		}),
		"tags": s.table({
			"path": s.string(),
		})
	},
});
