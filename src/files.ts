import { Env } from './types';

// 获取文件列表
export async function getFileList(env: Env): Promise<Response> {
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