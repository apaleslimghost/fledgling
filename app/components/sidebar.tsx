import { useNavigate } from "react-router";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { queries } from "~/zero/queries";
import { cuid } from "~/data/cuid";
import { mutators } from "~/zero/mutators";

export function Sidebar() {
	const zero = useZero()
	const navigate = useNavigate()

	const [tags] = useQuery(queries.tag.all({}))
	const [projects] = useQuery(queries.project.all({}))

	return (
		<aside>
			<button onClick={async () => {
				const id = cuid()
				const pending = zero.mutate(mutators.note.create({
					id
				}))

				await pending.client
				navigate(`/note/${id}`)
			}} className="surface lo">+ new note</button>

			<menu>
				{tags.map((tag) => (
					<li key={tag.id}>
						<a href={`/tag/${tag.id}`}>#{tag.path}</a>
					</li>
				))}
			</menu>

			<menu>
				{projects.map((project) => (
					<li key={project.id}>
						<a href={`/project/${project.id}`}>@{project.title}</a>
					</li>
				))}
			</menu>
		</aside>
	);
}
