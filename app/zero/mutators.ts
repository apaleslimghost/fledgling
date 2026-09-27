import { defineMutators, defineMutator } from '@rocicorp/zero'
import { z } from 'zod'
import { zql } from '~/prisma/generated/zero/schema'

export const mutators = defineMutators({
	workspace: {
		create: defineMutator(
			z.object({
				id: z.string(),
			}),
			async ({ tx, args }) => {
				await tx.mutate.Workspace.insert({
					id: args.id,
				})
			}
		),
	},

	note: {
		create: defineMutator(
			z.object({
				id: z.string(),
			}),
			async ({ tx, args, ctx }) => {
				if (!ctx) throw new Error('no workspace')

				await tx.mutate.Note.insert({
					id: args.id,
					workspaceId: ctx.workspaceId,
					title: '',
					content: {}
				})
			}
		),

		setTitle: defineMutator(
			z.object({
				id: z.string(),
				title: z.string(),
			}),
			async ({ tx, args }) => {
				await tx.mutate.Note.update(args)
			}
		),

		setContent: defineMutator(
			z.object({
				id: z.string(),
				content: z.json(),
				tagIds: z.array(z.string()),
			}),
			async ({ tx, args }) => {
				await tx.mutate.Note.update({
					id: args.id,
					content: args.content,
				})

				await Promise.all(args.tagIds.map(id => tx.mutate._NoteToTag.insert({ A: args.id, B: id })))
			}
		),
	},

	tag: {
		create: defineMutator(
			z.object({
				id: z.string(),
				path: z.string(),
			}),
			async ({ tx, args, ctx }) => {
				if (!ctx) throw new Error('no workspace')

				await tx.mutate.Tag.insert({
					id: args.id,
					workspaceId: ctx.workspaceId,
					path: args.path,
				})
			}
		),
		removeAndMaybeCleanUp: defineMutator(
			z.object({
				id: z.string(),
				noteId: z.string(),
			}),
			async ({ tx, args }) => {
				await tx.mutate._NoteToTag.delete({ A: args.noteId, B: args.id })

				const tag = await tx.run(zql.Tag.where('id', args.id).one().related('notes'))

				if (tag?.notes.length === 0) {
					await tx.mutate.Tag.delete({ id: args.id })
				}
			}
		),
	},

	project: {
		create: defineMutator(
			z.object({
				id: z.string(),
				title: z.string(),
			}),
			async ({ tx, args, ctx }) => {
				if (!ctx) throw new Error('no workspace')

				await tx.mutate.Project.insert({
					id: args.id,
					workspaceId: ctx.workspaceId,
					title: args.title,
				})
			},
		),
	},
})
