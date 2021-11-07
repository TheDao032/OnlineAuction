import React from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from "react-icons/ai";
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from "axios";
import { useSelector } from "react-redux";
const selectUser = (state) => state.currentUser;

ChangeEmail.propTypes = {

};

function ChangeEmail(props) {
    const history = useHistory()

    function handleBack() {
        history.goBack()
    }

    const userInfo = useSelector(selectUser).user;

    console.log("thong tin user la", userInfo.user);
    function handleBack() {
        history.goBack()
    }

    var userOldPass = "";
    const handleChange = (e) => {
        userOldPass = e.target.value;
    };

    var userNewPass = "";
    const handleChange1 = (e) => {
        userNewPass = e.target.value;
    };

    var confirmPassword = "";
    const handleChange2 = (e) => {
        confirmPassword = e.target.value;
    };

    function handleClick() {
        fetchUserPass();
        history.goBack()
    }

    const fetchUserPass = async () => {
        const Headers = {
            'authorization': userInfo.accessToken,
        };

        const response = await axios.post(
            "https://onlineauctionserver.herokuapp.com/api/account/update",
            {
                accOldPassword: userOldPass,
                accNewPassword : userNewPass,
                accConfirmPassword: confirmPassword
            },
            {
                headers: Headers
            }
        ).then(response => {
            console.log("Status: ", response.status);
            console.log("Data: ", response.data);
        }).catch(error => {
            console.error('Something went wrong!', error);
        });
    }
    return (
        <>
            <div className='profile__title'>
                <p className='profile__title-main'>
                    <AiFillCaretLeft style={{ cursor: 'pointer' }} onClick={handleBack} />
                    Đổi mật khẩu
                </p>
                <p className='profile__title-sub'>
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
                <hr />
            </div>
            <div className=' profile__box'>
                <span className='profile__label'>Mật khẩu cũ:</span>
                <input onChange={handleChange} type='password' />
            </div>
            <div className=' profile__box'>
                <span className='profile__label'>Mật khẩu mới:</span>
                <input onChange={handleChange1} />
            </div>
            <div className=' profile__box'>
                <span className='profile__label'>Nhập lại mật khẩu mới:</span>
                <input onChange={handleChange2} />
            </div>
            <button onClick={handleClick} className='change__button'>Lưu thay đổi</button>
        </>
    );
}

export default ChangeEmail;