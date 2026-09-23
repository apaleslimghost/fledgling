import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../prisma/generated/prisma/client'
import { zeroPrisma } from '@rocicorp/zero/server/adapters/prisma'
import { schema } from '../prisma/generated/zero/schema'

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.ZERO_UPSTREAM_DB!
	})
})

export const dbProvider = zeroPrisma(schema, prisma)

declare module '@rocicorp/zero' {
	interface DefaultTypes {
		dbProvider: typeof dbProvider
	}
}
