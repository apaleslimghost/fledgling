import { useState, type ComponentProps } from 'react';
import { NavLink, useMatch } from 'react-router';
import { useActiveTags, useWorkspace } from '~/data/context';
import { TagTree, type TagWithNotes } from '~/lib/tag-tree'
import { Icon } from './icon';

const TagLink = ({ tree, className, leaf }: { tree: TagTree; className?: string, leaf?: boolean }) => {
	const workspaceid = useWorkspace()
	return <>
		<NavLink className={`${className} ${leaf ? 'leaf' : ''}`} to={`/workspace/${workspaceid}/tag/${tree.tag.path}`} end>
			<Icon icon='Hashtag' className={leaf ? undefined : 'hover-hide'} />
			{!leaf && <Icon icon='ChevronRight' className='hover-show' />}

			{tree.path[tree.path.length - 1]}{leaf ? '' : '/'}
			{' '}
			<span className='chip'>
				{tree.notes.length}
			</span>
		</NavLink>
	</>
}

const TagBranch = ({ tree }: { tree: TagTree }) => {
	const [activeTags] = useActiveTags()
	console.log(activeTags)

	return (
		<li>
			{tree.map((child) =>
				Object.keys(child.children).length > 0 ? (
					<details key={child.tag.path} open={
						activeTags.some(
							t => {
								return child.tag.path && t.startsWith(child.tag.path + '/')
							}
						)
					}>
						<summary>
							<TagLink tree={child} />
						</summary>

						<ul><TagBranch tree={child} /></ul>
					</details>
				) : (
					<TagLink leaf tree={child} key={child.tag.path} />
				),
			)}
		</li>
	)
}

export default function TagTreeComponent({ tags }: { tags: TagWithNotes[] }) {
	const tree = TagTree.build(tags)
	return <TagBranch tree={tree} />
}
