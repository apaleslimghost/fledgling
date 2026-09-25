import { init } from "@paralleldrive/cuid2";

export const shortId = init({
	length: 10
})

export { createId as cuid } from '@paralleldrive/cuid2'
