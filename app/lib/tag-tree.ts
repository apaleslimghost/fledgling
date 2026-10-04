import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import type { Note, Tag } from '../data/schema'

export type TagWithNotes = Partial<Tag> & {
	notes: Note[]
}

type TagTreeJSON = {
	tag: TagWithNotes
	children: Record<string, TagTreeJSON>
}

export class TagTree {
	static hydrate(json: TagTreeJSON): TagTree {
		return new TagTree(
			json.tag,
			Object.fromEntries(
				Object.entries(json.children).map(([key, child]) => [key, TagTree.hydrate(child)]),
			),
		)
	}

	static build(tags: TagWithNotes[]) {
		const root = new TagTree()
		tags.forEach((tag) => {
			root.addTag(tag)
		})
		return root
	}

	constructor(
		public tag: TagWithNotes = { path: '', notes: [] },
		public children: Record<string, TagTree> = {},
	) { }

	toJSON(): TagTreeJSON {
		return {
			children: Object.fromEntries(
				Object.entries(this.children).map(([k, child]) => [k, child.toJSON()]),
			),
			tag: this.tag,
		}
	}

	addTag(tag: TagWithNotes) {
		const remainingPath = (tag.path ?? '').split('/').slice(this.path.length)
		const first = remainingPath[0]
		if (!first) return

		if (remainingPath.length === 1) {
			if (this.children[first]) {
				this.children[first].tag = tag
			} else {
				this.children[first] = new TagTree(tag)
			}
		} else {
			if (!this.children[first]) {
				this.children[first] = new TagTree({
					path: [...this.path, first].join('/'),
					notes: [],
				})
			}

			this.children[first].addTag(tag)
		}
	}

	map<T>(func: (child: TagTree) => T): T[] {
		return orderBy(Object.values(this.children), [['notes', 'length']], ['desc']).map(func)
	}

	get notes(): Note[] {
		return uniqBy(
			[...(this.tag?.notes ?? []), ...Object.values(this.children).flatMap((child) => child.notes)],
			'id',
		)
	}

	get path() {
		return this.tag.path ? this.tag.path.split('/') : []
	}

	get(path: string[], parentPath: string[] = []): TagTree {
		const first = path[0]
		if (!first) throw new Error('path is empty')

		const child =
			this.children[first] ??
			new TagTree({
				path: [...parentPath, first].join('/'),
				notes: [],
			})

		if (path.length === 1) {
			return child
		}

		return child.get(path.slice(1), [...parentPath, first])
	}
}
