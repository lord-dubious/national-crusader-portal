import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from './App'
import { dehydrate } from '@tanstack/react-query'

export function render(url: string) {
  // Create a new QueryClient for each render
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        suspense: true, // Enable suspense mode
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

  // Properly dehydrate the queryClient state
  const dehydratedState = dehydrate(queryClient)

  return { html, state: JSON.stringify(dehydratedState) }
}