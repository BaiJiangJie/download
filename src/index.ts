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

interface Env {
	R2_jumpserver: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			// 列出所有文件
			const files = await env.R2_jumpserver.list();
			console.log('Bucket contents:', files);
			
			// 格式化文件列表，按目录分组
			const fileList = files.objects.map(obj => ({
				name: obj.key,
				size: obj.size,
				lastModified: obj.uploaded.toISOString(),
				downloadUrl: `/download/${obj.key}`,
				directory: obj.key.split('/').slice(0, -1).join('/') || '/'
			}));

			// 按目录分组
			const groupedFiles = fileList.reduce((acc, file) => {
				if (!acc[file.directory]) {
					acc[file.directory] = [];
				}
				acc[file.directory].push(file);
				return acc;
			}, {} as Record<string, typeof fileList>);

			console.log('Grouped file list:', groupedFiles);
			return new Response(JSON.stringify(groupedFiles, null, 2), {
				headers: { "Content-Type": "application/json" }
			});
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return new Response(JSON.stringify({ error: errorMessage }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
} satisfies ExportedHandler<Env>;
