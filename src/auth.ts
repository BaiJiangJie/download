import { Env } from './types';


// Basic 认证检查函数
export async function checkAuth(request: Request, env: Env): Promise<Response | null> {
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
		
		// 认证成功，返回 null
		return null;
	} catch (error) {
		return new Response('Authentication error', { 
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"'
			}
		});
	}
} 