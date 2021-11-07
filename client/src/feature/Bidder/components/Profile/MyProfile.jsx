import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import { useSelector } from "react-redux";

const selectUser = (state) => state.currentUser;
Wishlist.propTypes = {};

function Wishlist(props) {
  const { url } = useRouteMatch()
  const history = useHistory()
  const currentUrl = window.location.href.split('/');
  
  const userInfo = useSelector(selectUser).user;

  console.log("thong tin user la", userInfo.user);

  // console.log(url)
  function handleChangeName() {
    history.push(`${url}/name`)
  }

  function handleChangePassword() {
    history.push(`${url}/password`)

  }

  function handleChangeEmail() {
    history.push(`${url}/email`)

  }


  
  return (
    <>
      <div className='profile__title'>
        <p className='profile__title-main'>Hồ Sơ Của Tôi</p>
        <p className='profile__title-sub'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
        <hr />
      </div>
      <div className='profile__name profile__box'>
        <span className='profile__label'>Họ tên:</span>
        <p>{userInfo.user.accName}</p>
        <button className='profile__btnChange' onClick={handleChangeName}>Thay đổi</button>
      </div>
      <div className='profile__password profile__box'>
        <span className='profile__label'>Mật khẩu:</span>
        <p>*************</p>
        <button className='profile__btnChange' onClick={handleChangePassword}>Thay đổi</button>
      </div>
      <div className='profile__email profile__box'>
        <span className='profile__label'>Email:</span>
        <p>{userInfo.user.accEmail}</p>
        <button className='profile__btnChange' onClick={handleChangeEmail}>Thay đổi</button>
      </div>
    </>
  );
}

export default Wishlist;
