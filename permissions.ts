import { schema as s } from "jazz-tools";
import { app } from "./schema.js";

export default s.definePermissions(app, ({ policy }) => {
	policy.notes.allowRead.always();
	policy.notes.allowInsert.always();
	policy.notes.allowUpdate.always();
	policy.notes.allowDelete.always();
	policy.tags.allowRead.always();
	policy.tags.allowInsert.always();
	policy.tags.allowUpdate.always();
	policy.tags.allowDelete.always();
	policy.projects.allowRead.always();
	policy.projects.allowInsert.always();
	policy.projects.allowUpdate.always();
	policy.projects.allowDelete.always();
});
