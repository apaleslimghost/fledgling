import { Prisma } from "@prisma/client";
import set from 'lodash/set'
import keyBy from 'lodash/keyBy'
import Link from "./link";



const TagBranch = ({ tree, path, tags }: { tree: TagPathTree, path: string[], tags: Record<string, TagWithNoteCount> }) => <ul>
	{Object.entries(tree.children).map(([node, tree]) => <li key={node}>
		<Link to={`/tag/${[...path, node].join('/')}`}>#{node}</Link>
		{' '}
		{tree.count}
		<TagBranch tree={tree} path={[...path, node]} tags={tags} />
	</li>)}
</ul>

export default function TagTree({ tags }: { tags: TagWithNoteCount[] }) {
	const tree = buildTree(tags)
	const keyed = keyBy(tags, 'path')

	return <>
		<TagBranch tree={tree} path={[]} tags={keyed} />
		<pre>{JSON.stringify(tree, null, 2)}</pre>
	</>
}
