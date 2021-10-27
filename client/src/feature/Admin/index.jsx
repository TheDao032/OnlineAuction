import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './scss/index.scss'
import { NavLink } from 'react-router-dom'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import AdminCategory from './components/Category';
import AdminProduct from './components/Product';
import AdminUser from './components/User';

AdminFeature.propTypes = {};

function AdminFeature(props) {
  const { url } = useRouteMatch()


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
