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
import { getFileList } from './files';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const authResponse = await checkAuth(request, env);
		if (authResponse) {
			return authResponse;
		}

		return await getFileList(env);
	}
} satisfies ExportedHandler<Env>;
