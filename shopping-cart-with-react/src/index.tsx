import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import CartProvider from './Context/globalContext';

const client = new QueryClient();

ReactDOM.render(

  <CartProvider>
    <QueryClientProvider client={client}>
        <App />
    </QueryClientProvider>
  </CartProvider>,
  document.getElementById('root')
);


