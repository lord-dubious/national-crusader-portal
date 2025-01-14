import { renderToString } from 'react-dom/server';
import { PageContextServer } from './types';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';

export { render };

async function render(pageContext: PageContextServer) {
  const { Page } = pageContext;
  const pageHtml = renderToString(<Page />);

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>National Crusader</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}