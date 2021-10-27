import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import './asset/css/grid.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Search from './components/pages/Search';
import Detail from './components/pages/Detail/Detail';
import AdminFeature from './feature/Admin';
import SellerFeature from './feature/Seller';
import BidderFeature from './feature/Bidder';
import SignIn from './components/pages/SignIn/SignIn';

function App() {
  const url = window.location.href.split('/');
  return (
    <Router>
      {url[3] === 'signup' || url[3] === 'sign-in' ? '' : <Navbar />}

      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/signup' component={Register} />
        <Route path='/sign-in'>
          <SignIn />
        </Route>
        <Route path='/search/:text' component={Search} />
        <Route path='/detail/:prodId' component={Detail} />
        <Route path='/admin'>
          <AdminFeature />
        </Route>
        <Route path='/seller'>
          <SellerFeature />
        </Route>
        <Route path='/bidder'>
          <BidderFeature />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
