import { remember } from '@epic-web/remember'
import { PrismaClient } from '@prisma/client'

export default remember('prisma', () => new PrismaClient())
