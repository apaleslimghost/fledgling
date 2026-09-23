import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'app/prisma/schema.prisma',
	datasource: {
		url: env('ZERO_UPSTREAM_DB'),
	},
});
