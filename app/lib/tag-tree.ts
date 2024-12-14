import uniqBy from "lodash/uniqBy"
import type { Note, Prisma } from "@prisma/client"
import orderBy from "lodash/orderBy"

export type TagWithNotes = Prisma.TagGetPayload<{
	include: {
		notes: true
	}
}>

type TagTreeJSON = {
	tag: TagWithNotes
	children: Record<string, TagTreeJSON>
}

export class TagTree {
	static hydrate(json: TagTreeJSON): TagTree {
		return new TagTree(
			json.tag,
			Object.fromEntries(
				Object.entries(json.children).map(
					([key, child]) => [
						key,
						TagTree.hydrate(child)
					]
				)
			)
		)
	}

	static build(tags: TagWithNotes[]) {
		const root = new TagTree()
		tags.forEach(tag => root.addTag(tag))
		return root
	}

	constructor(
		public tag: TagWithNotes = { path: '', notes: [] },
		public children: Record<string, TagTree> = {},
	) {}

	toJSON(): TagTreeJSON {
		return {
			children: Object.fromEntries(
				Object.entries(this.children).map(
					([k, child]) => [k, child.toJSON()]
				)
			),
			tag: this.tag
		}
	}

	addTag(tag: TagWithNotes) {
		const remainingPath = tag.path.split('/').slice(this.path.length)

		if(remainingPath.length === 1) {
			if(this.children[remainingPath[0]]) {
				this.children[remainingPath[0]].tag = tag
			} else {
				this.children[remainingPath[0]] = new TagTree(tag)
			}
		} else {
			if(!this.children[remainingPath[0]]) {
				this.children[remainingPath[0]] = new TagTree({
					path: [...this.path, remainingPath[0]].join('/'),
					notes: []
				})
			}

			this.children[remainingPath[0]].addTag(tag)
		}
	}

	map<T>(func: (child: TagTree) => T): T[] {
		return orderBy(Object.values(this.children), [['notes', 'length']], ['desc']).map(func)
	}

	get notes(): Note[] {
		return uniqBy(
			[
				...(this.tag?.notes ?? []),
				...Object.values(this.children).flatMap(
					child => child.notes
				)
			],
			'id'
		)
	}

	get path() {
		return this.tag.path ? this.tag.path.split('/') : []
	}

	get(path: string[], parentPath: string[] = []): TagTree {
		const child = this.children[path[0]] ?? new TagTree({
			path: [...parentPath, path[0]].join('/'),
			notes: []
		})

		if(path.length === 1) {
			return child
		}

		return child.get(path.slice(1), [...parentPath, path[0]])
	}
}
