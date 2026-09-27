import { Zero, type ZeroOptions } from "@rocicorp/zero";
import type { useZero } from "@rocicorp/zero/react";
import { schema } from "~/prisma/generated/zero/schema";
import { mutators } from "~/zero/mutators";

export const zeroOptions = {
	cacheURL: 'http://localhost:4848',
	schema,
	mutators
} satisfies Partial<ZeroOptions>

// export const zero = new Zero({
// 	...zeroOptions,
// 	context: undefined
// }) as ReturnType<typeof useZero> // hi wtf
