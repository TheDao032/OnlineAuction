import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import "./asset/css/grid.css";
import Navbar1 from "./components/Navbar";
import Detail from "./components/pages/Detail/Detail";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Search from "./components/pages/Search/Search";
import SignIn from "./components/pages/SignIn/SignIn";
import AdminFeature from "./feature/Admin";
import BidderFeature from "./feature/Bidder";
import SellerFeature from "./feature/Seller";
import { logIn } from "./redux/actions/userAction";
import Header from "./components/Header";
import Forgot from "./components/pages/Forgot/Forgot";
import Category from "./components/pages/Category";
// import SearchResult from './components/SearchResult';

function App() {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  if (localStorage.getItem("@user") !== null) {
    dispatch(logIn(JSON.parse(localStorage.getItem("@user"))));
  }

  // console.log('url nè: ', pathname);

  return (
    <>
      {pathname.includes("/signup") || pathname.includes("/sign-in") ? (
        ""
      ) : (
        <>
          <Header />
          <Navbar1 />
        </>
      )}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Register} />
        <Route exact path="/sign-in">
          <SignIn />
        </Route>
        <Route path={`/sign-in/forgot-password`}>
          <Forgot />
        </Route>
        <Route path="/search/:text" component={Search} />
        <Route exact path="/detail/:prodId" component={Detail} />
        <Route exact path="/category/:cateId">
          <Category />
        </Route>
        <Route path="/admin">
          <AdminFeature />
        </Route>
        <Route path="/seller">
          <SellerFeature />
        </Route>
        <Route path="/bidder">
          <BidderFeature />
        </Route>
      </Switch>
    </>
  );
}

export default App;
