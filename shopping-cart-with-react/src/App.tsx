//Style
import { AppWrapper, GlobalStyle } from "./App.style";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
//Component
import Header from './Header/Header'
import Home from "./Home/Home";
import CartPage from "./CartPage/CartPage";


//Shared Type -----------

export type CartItemTypes = {
  categoryId: number;
  description: string;
  id: number;
  imageURL: string;
  name: string;
  price: number;
  amount: number;
}



const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppWrapper>
        <Header />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/products" component={CartPage}>
            </Route>
          </Switch>
        </AppWrapper>
      </Router>
    </>
  )
}

export default App;
