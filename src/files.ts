import { Env } from './types';

export interface File {
	key: string;
	size: number;
	uploaded: string;
}

// 获取文件列表
export async function getFileList(env: Env): Promise<File[]> {
	const objects = await env.R2_jumpserver.list();
	
	// 将对象转换为数组并按照文件名降序排序
	return objects.objects
		.map(obj => ({
			key: obj.key,
			size: obj.size,
			uploaded: obj.uploaded.toISOString(),
		}))
		.sort((a, b) => {
			// 获取文件名（最后一个斜杠后的部分）
			const nameA = a.key.split('/').pop() || '';
			const nameB = b.key.split('/').pop() || '';
			// 降序排序
			return nameB.localeCompare(nameA);
		});
} 