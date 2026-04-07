import { ChevronDown, ChevronRight } from '@gravity-ui/icons'
import { Badge, Button, Chip, cn, Disclosure } from '@heroui/react'
import { useState } from 'react'
import { TagTree, type TagWithNotes } from '~/lib/tag-tree'
import Link from './link'

const TagLink = ({ tree }: { tree: TagTree }) => (
	<>
		<Link to={`/tag/${tree.tag.path}`}>#{tree.path[tree.path.length - 1]}</Link>{' '}
		<Chip variant="soft" size="sm">
			{tree.notes.length}
		</Chip>
	</>
)

const TagBranch = ({ tree }: { tree: TagTree }) => {
	const [expanded, setExpanded] = useState(true)
	return (
		<>
			{tree.map((child) =>
				Object.keys(child.children).length > 0 ? (
					<Disclosure key={child.tag.path} isExpanded={expanded} onExpandedChange={setExpanded}>
						<Disclosure.Heading>
							<Button
								isIconOnly
								size="sm"
								slot="trigger"
								variant="ghost"
								className="float-start -mt-0.75"
							>
								<ChevronRight className={cn('transition-transform', { 'rotate-90': expanded })} />
							</Button>
							<TagLink tree={child} />
						</Disclosure.Heading>

						<Disclosure.Content>
							<div className="ml-4">
								<TagBranch tree={child} />
							</div>
						</Disclosure.Content>
					</Disclosure>
				) : (
					<div className="ml-8" key={child.tag.path}>
						<TagLink tree={child} />
					</div>
				),
			)}
		</>
	)
}

export default function TagTreeComponent({ tags }: { tags: TagWithNotes[] }) {
	const tree = TagTree.build(tags)
	return <TagBranch tree={tree} />
}
