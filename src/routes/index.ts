import { Env } from '../types';
import { handleDownload } from './download';
import { handleHome } from './home';

type RouteHandler = (request: Request, env: Env) => Promise<Response>;

const routes: Record<string, RouteHandler> = {
    '/': handleHome,
    '/download': handleDownload,
    // 在这里添加更多路由
};

export async function handleRequest(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 查找匹配的路由处理器
    const handler = routes[pathname];
    if (handler) {
        return handler(request, env);
    }

    // 如果没有找到匹配的路由，返回 404
    return new Response('Not Found', { status: 404 });
} 