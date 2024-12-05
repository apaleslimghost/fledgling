import type { JSONContent } from "@tiptap/react"

declare global {
	namespace PrismaJson {
		type TiptapJSONContent = JSONContent | null
	}
}
