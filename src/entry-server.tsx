import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from './App'

export function render(url: string) {
  // Create a new QueryClient for each render
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )

  // Serialize the query state
  const dehydratedState = JSON.stringify(queryClient.getQueryData([]))

  return { html, state: dehydratedState }
}