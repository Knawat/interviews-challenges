import "./App.css";

import AppRouter from "./router/Router";
import { ProductContextProvider } from "./context/ProductContext";


function App() {

  return (
    <ProductContextProvider>
      <div className="App">
        <AppRouter />
      </div>
    </ProductContextProvider>
  );
}

export default App;
