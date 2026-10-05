import { useState } from 'react';
import { NavLink } from 'react-router';
import { useWorkspace } from '~/data/context';
import { TagTree, type TagWithNotes } from '~/lib/tag-tree'
import { Icon } from './icon';

const TagLink = ({ tree, className }: { tree: TagTree; className?: string }) => {
	const workspaceid = useWorkspace()
	return <>
		<NavLink className={className} to={`/workspace/${workspaceid}/tag/${tree.tag.path}`}>
			#{tree.path[tree.path.length - 1]}
			{' '}
			<span className='chip'>
				{tree.notes.length}
			</span>
		</NavLink>
	</>
}

const TagBranch = ({ tree }: { tree: TagTree }) => {
	return (
		<li>
			{tree.map((child) =>
				Object.keys(child.children).length > 0 ? (
					<details key={child.tag.path}>
						<summary>
							<Icon icon='ChevronRight' />
							<TagLink tree={child} />
						</summary>

						<ul><TagBranch tree={child} /></ul>
					</details>
				) : (
					<div className="leaf" key={child.tag.path}>
						<TagLink tree={child} />
					</div>
				),
			)}
		</li>
	)
}

export default function TagTreeComponent({ tags }: { tags: TagWithNotes[] }) {
	const tree = TagTree.build(tags)
	return <TagBranch tree={tree} />
}
