import Link from "./link";
import { TagTree, TagWithNotes } from "~/lib/tag-tree";

const TagLink = ({ tree }: {tree: TagTree}) => <>
	<Link to={`/tag/${tree.tag.path}`}>#{tree.path[tree.path.length - 1]}</Link>
	{' '}
	{tree.notes.length}
</>

const TagBranch = ({ tree }: { tree: TagTree }) => <ul>
	{tree.map(child => <li key={child.tag.path}>
		{Object.keys(child.children).length > 0 ?
			<details open>
				<summary>
					<TagLink tree={child} />
				</summary>

				<TagBranch tree={child} />
			</details>
			: <TagLink tree={child} />}
	</li>)}
</ul>

export default function TagTreeComponent({ tags }: { tags: TagWithNotes[] }) {
	const tree = TagTree.build(tags)
	return <TagBranch tree={tree} />
}
