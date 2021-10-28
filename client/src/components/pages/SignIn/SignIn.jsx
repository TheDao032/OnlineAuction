import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import './SignIn.scss';
import InputField from '../../formComtrol/inputField';
import PasswordField from '../../formComtrol/passwordField';
import { FaFacebookSquare, FaGooglePlusG, FaTwitter } from "react-icons/fa";
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import axios from 'axios';

SignIn.propTypes = {};


function SignIn(props) {
  const history = useHistory()
  const [err, setErr] = useState('');

  const schema = yup.object().shape({
    accEmail: yup
      .string()
      .required('Email không thể trống')
      .email('Email không đúng định dạng')
      .max(100, 'Tối đa 100 kí tự'),
    accPassword: yup
      .string()
      .required('Mật khẩu không thể trống')
      .max(100, 'Tối đa 100 kí tự'),
  });

  const form = useForm({
    defaultValues: {
      accEmail: '',
      accPassword: '',
    },

    resolver: yupResolver(schema),
  });

  function directSignUp() {
    history.push(`/signup`)
  }

  const handleOnSubmit = async (data) => {
    const postData = {
      accEmail: data.accEmail.toString(),
      accPassword: data.accPassword.toString()
    }
    try {
      const response = await axios
        .post('https://onlineauctionserver.herokuapp.com/api/authentication/login', postData)

      console.log('thế đạo cho dữ lieu: ', response.data.data);
      const user = response.data.data.user
      if (localStorage.getItem('@user') === null) {
        localStorage.setItem('@user', JSON.stringify(user))
      }
      else {
        localStorage.setItem('@user', JSON.stringify(user))
      }

      setErr('')
      history.goBack()
    } catch (error) {
      let errorMessage = error.response.data.errorMessage
      if (errorMessage === 'Password Incorrect!') errorMessage = "Mật khẩu không đúng"
      else if (errorMessage === 'User Does Not Exist!') errorMessage = "Người dùng không tồn tại"
      console.log(error.response);
      setErr(errorMessage)
    }


  };

  return (
    <div className='signIn'>
      <div className='signIn__container'>
        <h2>ĐĂNG NHẬP</h2>
        <hr />
        {err !== '' && <p className='signIn__noti'>{err}</p>}

        <form className="signIn__form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <InputField form={form} name='accEmail' label='Email' labelClass='form__group-label' />
          <PasswordField form={form} name='accPassword' label='Mật khẩu' labelClass='form__group-label' />
          <input type='submit' className='signIn__button' value='Đăng nhập' />
          <p className='signIn__res'>Chưa có tài khoản? <span onClick={directSignUp}>Đăng ký ngay</span></p>

          <p className='signIn__or'>Hoặc</p>
          <div className='signIn__another signIn__another-fb'>
            <FaFacebookSquare />
            <p className='signIn__title'>Đăng nhập bằng Facebook</p>
          </div>
          <div className='signIn__another signIn__another-gg'>
            <FaGooglePlusG />
            <p className='signIn__title'>Đăng nhập bằng Google</p>
          </div>
          <div className='signIn__another signIn__another-tt'>
            <FaTwitter />
            <p className='signIn__title'>Đăng nhập bằng Twitter</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
