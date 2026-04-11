import { ChevronRight } from '@gravity-ui/icons'
import { Badge, Button, Chip, cn, Disclosure } from '@heroui/react'
import { useState } from 'react'
import { TagTree, type TagWithNotes } from '~/lib/tag-tree'
import { NavLink } from './link'

const TagLink = ({ tree, className }: { tree: TagTree; className?: string }) => (
	<>
		<NavLink className={className} to={`/tag/${tree.tag.path}`}>
			#{tree.path[tree.path.length - 1]}
		</NavLink>{' '}
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
								className="absolute -my-0.75"
							>
								<ChevronRight className={cn('transition-transform', { 'rotate-90': expanded })} />
							</Button>
							<TagLink className="ml-8" tree={child} />
						</Disclosure.Heading>

						<Disclosure.Content className="ml-5">
							<TagBranch tree={child} />
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
