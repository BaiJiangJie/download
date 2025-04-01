import { Env } from './types';

export interface File {
	key: string;
	size: number;
	uploaded: string;
}

// 获取文件列表
export async function getFileList(env: Env): Promise<File[]> {
	const objects = await env.R2_jumpserver.list();
	return objects.objects.map(obj => ({
		key: obj.key,
		size: obj.size,
		uploaded: obj.uploaded.toISOString()	
    }));
} 