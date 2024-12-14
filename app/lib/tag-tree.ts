import uniqBy from "lodash/uniqBy"
import type { Note, Prisma } from "@prisma/client"

export type TagWithNotes = Prisma.TagGetPayload<{
	include: {
		notes: true
	}
}>

type TagTreeJSON = {
	tag: TagWithNotes
	children: Record<string, TagTreeJSON>
}

type HmmJSON = {
	tag: { path: string }
	children: Record<string, HmmJSON>,
	notes: number[]
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

	hmm(): HmmJSON {
		return {
			children: Object.fromEntries(
				Object.entries(this.children).map(
					([k, child]) => [k, child.hmm()]
				)
			),
			tag: { path: this.tag.path },
			notes: this.notes.map(note => note.id)
		}
	}

	addTag(tag: TagWithNotes) {
		const path = this.tag.path ? this.tag.path.split('/') : []
		const remainingPath = tag.path.split('/').slice(path.length)

		if(remainingPath.length === 1) {
			if(this.children[remainingPath[0]]) {
				this.children[remainingPath[0]].tag = tag
			} else {
				this.children[remainingPath[0]] = new TagTree(tag)
			}
		} else {
			if(!this.children[remainingPath[0]]) {
				this.children[remainingPath[0]] = new TagTree({
					path: [...path, remainingPath[0]].join('/'),
					notes: []
				})
			}

			this.children[remainingPath[0]].addTag(tag)
		}
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
