/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Env } from './types';
import { checkAuth } from './auth';
import { handleRequest } from './routes';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// 第一步：认证检查
		const authError = await checkAuth(request, env);
		if (authError) {
			return authError;
		}

		// 第二步：路由处理
		return handleRequest(request, env);
	}
} satisfies ExportedHandler<Env>;

