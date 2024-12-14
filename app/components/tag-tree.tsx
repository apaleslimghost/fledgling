import Link from "./link";
import { TagTree, TagWithNotes } from "~/lib/tag-tree";

const TagBranch = ({ tree }: { tree: TagTree }) => <ul>
	{Object.entries(tree.children).map(([node, child]) => <li key={child.tag.path}>
		<Link to={`/tag/${child.tag.path}`}>#{node}</Link>
		{' '}
		{child.notes.length}
		<TagBranch tree={child} />
	</li>)}
</ul>

export default function TagTreeComponent({ tags }: { tags: TagWithNotes[] }) {
	const tree = TagTree.build(tags)
	return <TagBranch tree={tree} />
}
