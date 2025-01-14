import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import App from './App'

// Create a client-side QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      suspense: true, // Enable suspense mode
    },
  },
})

// Get the dehydrated state from the window
const dehydratedState = window.__INITIAL_STATE__

// Hydrate the app
ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <TooltipProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TooltipProvider>
      </Hydrate>
    </QueryClientProvider>
  </React.StrictMode>
)