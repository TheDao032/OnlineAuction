import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import CreatePost from './components/CreatePost';
import './scss/index.scss'
import ManageItem from './components/ManageItem';

SellerFeature.propTypes = {};

function SellerFeature(props) {
  const { url } = useRouteMatch()

  return <div className='seller grid wide'>
    <div className='seller__header'>
      <div className='seller__title'>
        Seller feature
      </div>
      <SellerAction />
    </div>
    <hr />
    <Switch>
      <Route path={`${url}/create-post`}>
        <CreatePost />
      </Route>
      <Route path={`${url}/manage`}>
        <ManageItem />
      </Route>
    </Switch>
  </div>;
}

function SellerAction() {
  const { url } = useRouteMatch()
  const history = useHistory()
  const currentUrl = window.location.href.split('/')

  console.log(currentUrl[4]);

  const handleDirectPost = () => {
    history.push(`${url}/create-post`)
  }

  const handleBack = () => {
    history.push(`${url}`)
  }

  const handleManageItem = () => {
    history.push(`${url}/manage`)
  }

  const ButtonSeller = {
    CreateItemButton() {
      return (
        <button className='seller__btn seller__btn-post' onClick={handleDirectPost}>Đăng sản phẩm mới</button>
      )
    },
    BackButton() {
      return (
        <button className='seller__btn seller__btn-back' onClick={handleBack}>Quay lại</button>
      )
    },
    ManageItem() {
      return (
        <button className='seller__btn seller__btn-manage' onClick={handleManageItem}>Quản lí hồ sơ</button>
      )
    },
  }


  return (
    <div className='seller__action'>
      {
        currentUrl[4] === undefined && currentUrl[3] === 'seller'
          ?
          <>
            <ButtonSeller.CreateItemButton />
            <ButtonSeller.ManageItem />
          </>
          : (currentUrl[4] === 'create-post' && currentUrl[3] === 'seller'
            ?
            <>
              <ButtonSeller.ManageItem />
              <ButtonSeller.BackButton />
            </>
            :
            <>
              <ButtonSeller.CreateItemButton />
              <ButtonSeller.BackButton />
            </>
          )
      }
    </div>
  )
}

export default SellerFeature;
