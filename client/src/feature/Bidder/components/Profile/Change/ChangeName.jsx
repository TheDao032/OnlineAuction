import React from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from "react-icons/ai";
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from "axios";
import { useSelector } from "react-redux";
const selectUser = (state) => state.currentUser;



ChangeName.propTypes = {

};

function ChangeName(props) {

    const userInfo = useSelector(selectUser).user;

    console.log("thong tin user la", userInfo.user);
    const history = useHistory()

    function handleBack() {
        history.goBack()
    }

    var userName = "";
    const handleChange = (e) => {
        userName = e.target.value;
    };

    function handleClick() {
        fetchUserName();
        history.goBack()
    }

   


    const fetchUserName = async () => {
        const Headers = {
            'authorization': userInfo.accessToken,
        };

        const response = await axios.post(
            "https://onlineauctionserver.herokuapp.com/api/account/update",
            {
                accFullName: userName
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
                    Đổi tên
                </p>
                <p className='profile__title-sub'>
                    Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
                <hr />
            </div>
            <div className='profile__box'>
                <span className='profile__label'>Họ tên mới:</span>
                <input onChange={handleChange} />
            </div>
            <button onClick={handleClick} className='change__button'>Lưu thay đổi</button>
        </>
    );
}

export default ChangeName;