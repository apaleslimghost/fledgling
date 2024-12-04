import { Tag } from "@prisma/client";
import set from 'lodash/set'
import Link from "./link";

type TagPathTree = {
	[node: string]: TagPathTree
}

const buildTree = (paths: string[][]): TagPathTree => paths.reduce(
	(tree, path) => set(tree, path, {}),
	{}
)

const TagBranch = ({ tree, path }: { tree: TagPathTree, path: string[] }) => <ul>
	{Object.entries(tree).map(([node, tree]) => <li key={node}>
		<Link to={`/tag/${[...path, node].join('/')}`}>#{node}</Link>
		<TagBranch tree={tree} path={[...path, node]} />
	</li>)}
</ul>

export default function TagTree({ tags }: { tags: Tag[] }) {
	const tree = buildTree(tags.map(tag => tag.path.split('/')))

	return <TagBranch tree={tree} path={[]} />
}
