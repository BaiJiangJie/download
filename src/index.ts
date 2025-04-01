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
	D1_jumpserver: D1Database;
}

// Basic 认证检查函数
async function checkAuth(request: Request, env: Env): Promise<Response> {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader) {
		return new Response('Authentication required', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}

	try {
		const [type, credentials] = authHeader.split(' ');
		if (type !== 'Basic') {
			return new Response('Invalid authentication method', { 
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Secure Area"'
				}
			});
		}

		const [username, password] = atob(credentials).split(':');
		
		// 从 D1 数据库验证用户
		const result = await env.D1_jumpserver.prepare(
			'SELECT * FROM users WHERE username = ? AND password = ?'
		).bind(username, password).first();

		if (!result) {
			return new Response('Invalid credentials', { 
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Secure Area"'
				}
			});
		}
		
		// 认证成功，返回文件列表
		return getFileList(env);
	} catch (error) {
		return new Response('Authentication error', { 
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}
}

// 获取文件列表
async function getFileList(env: Env): Promise<Response> {
	try {
		// 列出所有文件
		const files = await env.R2_jumpserver.list();
		
		// 按目录分组文件
		const groupedFiles = files.objects.reduce((acc, obj) => {
			const dir = obj.key.split('/').slice(0, -1).join('/') || '/';
			if (!acc[dir]) {
				acc[dir] = [];
			}
			acc[dir].push({
				name: obj.key.split('/').pop() || obj.key,
				key: obj.key,
				size: obj.size,
				lastModified: obj.uploaded.toISOString()
			});
			return acc;
		}, {} as Record<string, any[]>);
		
		// 返回文件列表
		return new Response(JSON.stringify({
			message: 'Successfully connected to R2',
			totalFiles: files.objects.length,
			directories: Object.keys(groupedFiles),
			files: groupedFiles
		}, null, 2), {
			headers: { 
				"Content-Type": "application/json"
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		return new Response(JSON.stringify({ 
			error: errorMessage,
			debug: {
				bucketName: 'jumpserver',
				errorType: error instanceof Error ? error.constructor.name : typeof error
			}
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 检查认证
		const authResponse = await checkAuth(request, env);
		
		// 如果认证失败，返回认证响应（会触发浏览器认证框）
		return authResponse;
	},
} satisfies ExportedHandler<Env>;
