import React from 'react';
import ReactDOMServer from 'react-dom/server';

export function renderToString(component: React.ReactElement): string {
    return ReactDOMServer.renderToString(component);
}

export function renderToStaticMarkup(component: React.ReactElement): string {
    return ReactDOMServer.renderToStaticMarkup(component);
} 