import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "@/main.scss"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import store from './store/store.jsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
  <ReactQueryDevtools initialIsOpen={false} />
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </QueryClientProvider>
  </Provider>
)
