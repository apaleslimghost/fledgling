import { Prisma, Tag } from "@prisma/client";
import set from 'lodash/set'
import keyBy from 'lodash/keyBy'
import Link from "./link";

type TagPathTree = {
	[count: symbol]: number
	[node: string]: TagPathTree
}

type TagWithNoteCount = Prisma.TagGetPayload<{
	include: {
		_count: {
			select: {
				notes: true
			}
		}
	}
}>

const count = Symbol('count')

const buildTree = (tags: TagWithNoteCount[]): TagPathTree => tags.reduce(
	(tree, tag) => set(tree, tag.path.split('/'), { [count]: tag._count.notes }),
	{}
)

const TagBranch = ({ tree, path, tags }: { tree: TagPathTree, path: string[], tags: Record<string, TagWithNoteCount> }) => <ul>
	{Object.entries(tree).map(([node, tree]) => <li key={node}>
		<Link to={`/tag/${[...path, node].join('/')}`}>#{node}</Link>
		{' '}
		{tree[count]}
		<TagBranch tree={tree} path={[...path, node]} tags={tags} />
	</li>)}
</ul>

export default function TagTree({ tags }: { tags: TagWithNoteCount[] }) {
	const tree = buildTree(tags)
	const keyed = keyBy(tags, 'path')

	return <TagBranch tree={tree} path={[]} tags={keyed} />
}
