import { Env } from '../types';
import { getFileList } from '../files';
import { FileList } from '../components/FileList';
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
                <title>File List</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                ${renderToStaticMarkup(React.createElement(FileList, { files }))}
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