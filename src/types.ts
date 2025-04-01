import { R2Bucket, D1Database } from '@cloudflare/workers-types';

export interface Env {
	R2_jumpserver: R2Bucket;
	D1_jumpserver: D1Database;
} 