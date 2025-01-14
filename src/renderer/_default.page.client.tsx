import { hydrateRoot } from 'react-dom/client';
import { PageContextClient } from './types';

export { render };

async function render(pageContext: PageContextClient) {
  const { Page } = pageContext;
  hydrateRoot(
    document.getElementById('root')!,
    <Page />
  );
}