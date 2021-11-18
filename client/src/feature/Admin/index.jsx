import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './scss/index.scss'
import { NavLink } from 'react-router-dom'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import AdminCategory from './components/Category';
import AdminProduct from './components/Product';
import AdminUser from './components/User';
import { useSelector} from 'react-redux';


AdminFeature.propTypes = {};


function AdminFeature(props) {
  const { url } = useRouteMatch()
  // const { user: { accessToken, user: {role} } } = useSelector(state => state.currentUser);
  const { loggedIn, user } = useSelector((state) => state.currentUser);
  let accessToken = '';
  let role = '';

  if (loggedIn) {
    accessToken = user.accessToken;
    role = user.role;
  }
  const history = useHistory();
  useEffect(() => {
    const token =  accessToken;
    if (token === '') {
      history.replace("/sign-in")
    }
    // if(token !== '' && role === 'SEL')
    // {
    //   alert("dsdfsdfsdfs");
    //   history.push("/bidder");
    // }
    // else{
    //   if(role === 'SEL' || role === 'BID')
    //   {
    //     console.log("----------------------------------------fhgfhfghgfhf");
    //     
    //   }
    // }
  },[])


  return <section className='admin__container grid wide'>
    <ul className='admin__nav'>
      <li>
        <NavLink className='admin__nav-item' to={`${url}/category`}>Category</NavLink>
      </li>
      <li>
        <NavLink className='admin__nav-item' to={`${url}/product`}>Product</NavLink>
      </li>
      <li>
        <NavLink className='admin__nav-item' to={`${url}/user`}>User</NavLink>
      </li>
    </ul>
    <div>
      {/* Ấn vô cái nào thì fetch dữ liệu cái đó đổ vô */}

      <Switch>
        <Route path={`${url}/category`}>
          <AdminCategory />
        </Route>
        <Route path={`${url}/product`}>
          <AdminProduct />
        </Route>
        <Route path={`${url}/user`}>
          <AdminUser />
        </Route>
      </Switch>
    </div>
  </section>;
}

export default AdminFeature;
