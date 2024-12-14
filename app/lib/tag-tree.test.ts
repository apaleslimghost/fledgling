import { describe, it, TestContext } from 'node:test'
import { TagTree } from './tag-tree'

const placeholderTag = (path: string) => ({ path, notes: [] })

describe('TagTree', () => {
	it('should build a tree from an array of tags', (t: TestContext) => {
		const tags = [
			{ path: 'a/b/c', notes: [] },
			{ path: 'a/d/e', notes: [] },
			{ path: 'f/g/h', notes: []},
			{ path: 'f/g/i', notes: []},
			{ path: 'f', notes: []},
		]
		const tree = TagTree.build(tags)

		t.assert.deepStrictEqual(tree.toJSON(), {
			tag: placeholderTag(''),
			children: {
				a: {
					tag: placeholderTag('a'),
					children: {
						b: {
							tag: placeholderTag('a/b'),
							children: {
								c: {
									children: {},
									tag: tags[0]
								}
							}
						},
						d: {
							tag: placeholderTag('a/d'),
							children: {
								e: {
									children: {},
									tag: tags[1]
								}
							}
						}
					}
				},
				f: {
					tag: tags[4],
					children: {
						g: {
							tag: placeholderTag('f/g'),
							children: {
								h: {
									children: {},
									tag: tags[2]
								},
								i: {
									children: {},
									tag: tags[3]
								},
							}
						}
					}
				}
			}
		})
	})

	it('should get descendent tags by path', (t: TestContext) => {
		const tags = [
			{ path: 'a/b/c', notes: [] },
			{ path: 'a/d/e', notes: [] },
			{ path: 'f/g/h', notes: []},
			{ path: 'f/g/i', notes: []},
			{ path: 'f', notes: []},
		]

		const tree = TagTree.build(tags)

		t.assert.deepStrictEqual(tree.get(['a', 'd', 'e']).tag, tags[1])
		t.assert.deepStrictEqual(tree.get(['f', 'g']).tag, placeholderTag('f/g'))
	})

	it('should bubble up descendent notes', (t: TestContext) => {
		t.mock.timers.enable({ apis: ['Date'] });

		const notes = [
			{ id: 0, completed: false, created: new Date(), text: {}, due: null },
			{ id: 1, completed: false, created: new Date(), text: {}, due: null },
			{ id: 2, completed: false, created: new Date(), text: {}, due: null },
			{ id: 3, completed: false, created: new Date(), text: {}, due: null },
		]

		const tags = [
			{ path: 'a/b/c', notes: [notes[0]] },
			{ path: 'a/d/e', notes: [notes[1]] },
			{ path: 'f/g/h', notes: [notes[3]]},
			{ path: 'f/g/i', notes: [notes[3]]},
			{ path: 'f', notes: [notes[2]]},
		]
		const tree = TagTree.build(tags)

		// notes are returned breadth-first
		t.assert.deepStrictEqual(tree.notes, [
			notes[0],
			notes[1],
			notes[2],
			notes[3]
		])

		t.assert.deepStrictEqual(tree.get(['a']).notes, [
			notes[0],
			notes[1]
		])

		t.assert.deepStrictEqual(tree.get(['f', 'g']).notes, [
			notes[3]
		])
	})
})
