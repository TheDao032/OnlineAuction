import React from 'react';
import PropTypes from 'prop-types';
import { AiFillCaretLeft } from "react-icons/ai";
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';

ChangeEmail.propTypes = {

};

function ChangeEmail(props) {
    const history = useHistory()

    function handleBack() {
        history.goBack()
    }
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
                <input />
            </div>

            <button className='change__button'>Lưu thay đổi</button>
        </>
    );
}

export default ChangeEmail;