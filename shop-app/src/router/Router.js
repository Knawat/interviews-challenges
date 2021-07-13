import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import Navbar from "../components/Navbar";
import DetailPage from "../components/DetailPage";
import Footer from "../components/Footer";

import React from "react";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/cartPage" component={CartPage} />
        <Route path="/detailPage" component={DetailPage} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default AppRouter;
