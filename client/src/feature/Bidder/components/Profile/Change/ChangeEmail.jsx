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
    const history = useHistory();
    const userInfo = useSelector(selectUser).user;

    function handleBack() {
        history.goBack()
    }

    var userEmail = "";
    const handleChange = (e) => {
        userEmail = e.target.value;
    };

    function handleClick() {
        fetchUserEmail().then()
        console.log('dasajldaslk');
        // history.goBack()
    }

    const fetchUserEmail = async () => {
        const Headers = {
            'authorization': userInfo.accessToken,
        };

        const response = await axios.post(
            "https://onlineauctionserver.herokuapp.com/api/account/update",
            {
                accEmail: userEmail
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
    };

    return (
        <>
            <div className='profile__title'>
                <p className='profile__title-main'>
                    <AiFillCaretLeft style={{ cursor: 'pointer' }} onClick={handleBack} />
                    Đổi email
                </p>
                <p className='profile__title-sub'>
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
                <hr />
            </div>
            <div className=' profile__box'>
                <span className='profile__label'>Email mới:</span>
                <input onChange={handleChange} />
            </div>
            <button onClick={handleClick} className='change__button'>Lưu thay đổi</button>
        </>
    );
}

export default ChangeEmail;