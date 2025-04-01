import { Env } from '../types';

export async function handleDownload(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const file = url.searchParams.get('file');

    if (!file) {
        return new Response('Invalid download request', { status: 400 });
    }

    try {
        // 创建缓存键
        const cacheKey = new Request(`https://${url.host}/download/${file}`);
        
        // 尝试从缓存获取
        const cache = caches.default;
        let response = await cache.match(cacheKey);
        
        if (!response) {
            // 缓存未命中，从 R2 获取
            const object = await env.R2_jumpserver.get(file);
            if (!object) {
                return new Response('File not found', { status: 404 });
            }

            // 创建响应
            response = new Response(object.body as ReadableStream, {
                headers: {
                    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${file.split('/').pop()}"`,
                    'Content-Length': object.size.toString(),
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'ETag': `"${object.uploaded.getTime()}-${object.size}"`,
                    'Last-Modified': object.uploaded.toUTCString(),
                },
            });

            // 将响应存入缓存
            await cache.put(cacheKey, response.clone());
        }

        return response;
    } catch (error) {
        console.error('Download error:', error);
        return new Response('Download error', { status: 500 });
    }
} 