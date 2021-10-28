import React from 'react';
import PropTypes from 'prop-types';
import { FaUser } from "react-icons/fa";
import './DropDownMenu.scss';
import { useHistory } from 'react-router-dom';


DropDownMenu.propTypes = {};

const Profile = {
  Bidder() {
    const history = useHistory()

    function directBidderProfile() {
      history.push('/profile/my-profile')
    }

    return (
      <>
        <span className='menu-signin__menu-item' onClick={directBidderProfile}>Hồ sơ của bạn</span>
      </>
    )
  },
  Seller() {
    const history = useHistory()

    function directSellerProfile() {
      history.push('/seller')
    }
    return (
      <>
        <span className='menu-signin__menu-item' onClick={directSellerProfile}>Hồ sơ của bạn</span>
      </>
    )
  },
  Admin() {
    const history = useHistory()

    function directAdminProfile() {
      history.push('/admin/category')
    }
    return (
      <>
        <span className='menu-signin__menu-item' onClick={directAdminProfile}>Hồ sơ của bạn</span>
      </>
    )
  },
}

function DropDownMenu({ }) {
  const dataUser = JSON.parse(localStorage.getItem('@user'))
  let role = dataUser === null ? '' : dataUser?.role
  console.log(role)
  return <div className='menu-signin'>
    <div className="menu-signin__btn">
      <FaUser />
      <p>Phan Vũ Thanh Đạo Phan Vũ Thanh Đạo</p>
    </div>
    <div className='menu-signin__menu'>
      {
        role === 'BID'
          ? <Profile.Bidder />
          : (role === 'SEL'
            ? <Profile.Seller />
            : (role === 'ADM'
              ? <Profile.Admin />
              : ''))
      }
      <span className='menu-signin__menu-item'>Đăng xuất</span>
    </div>
  </div>;
}


export default DropDownMenu;
