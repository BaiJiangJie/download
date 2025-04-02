import { Env } from '../types';
import { getFileList } from '../files';
import { FileTable } from '../components/FileTable';
import { renderToStaticMarkup } from '../utils/render';
import React from 'react';

export async function handleHome(request: Request, env: Env): Promise<Response> {
    const files = await getFileList(env);
    const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>JumpServer Enterprise Installation Packages</title>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2">
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${renderToStaticMarkup(React.createElement(FileTable, { files }))}
            </body>
        </html>
    `;

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store',
        },
    });
} 