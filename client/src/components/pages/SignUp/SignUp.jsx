import axios from 'axios';
import React, { useState } from 'react';
import '../../../asset/css/SignUp.css';
import './SignUp.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router';
import InputField from '../../formComtrol/inputField';
import PasswordField from '../../formComtrol/passwordField';

function SignUp() {
  const history = useHistory();
  const [err, setErr] = useState(false);

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
    retype_pw: yup
      .string()
      .oneOf([yup.ref('accPassword')], 'Mật khẩu không khớp'),
    accFullName: yup.string().max(100, 'Tối đa 100 kí tự'),
    accPhoneNumber: yup.string().max(15, 'Tối đa 15 kí tự'),
  });

  const form = useForm({
    defaultValues: {
      accEmail: '',
      accPassword: '',
      retype_pw: '',
      accFullName: '',
      accPhoneNumber: '',
    },

    resolver: yupResolver(schema),
  });

  function directSignIn() {
    history.push(`/sign-in`);
  }

  const handleOnSubmit = async (data) => {
    console.log(data);

    const postData = {
      // "accEmail": data.accEmail.toString(),
      // "accPassword": data.accPassword.toString()

      "accEmail" : "jirochuoi@gmail.com",
      "accPassword" : "123"



    }
    
    const res = await axios
      .post(
        'https://onlineauctionserver.herokuapp.com/api/authentication/register',
        postData
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    console.log("da ta dang ky", data);
    console.log('kết quả trả về: ', res);
  };

  return (
    <div className='signUp'>
      <div className='signUp__container'>
        <h2>ĐĂNG KÝ</h2>
        <hr />
        {err && <p className='signUp__noti'>Người dùng không tồn tại</p>}
        <form
          className='signUp__form'
          onSubmit={form.handleSubmit(handleOnSubmit)}
        >
          <InputField
            form={form}
            name='accEmail'
            label='Email'
            labelClass='form__group-label'
          />
          <PasswordField
            form={form}
            name='accPassword'
            label='Mật khẩu'
            labelClass='form__group-label'
          />
          <PasswordField
            form={form}
            name='retype_pw'
            label='Xác nhận'
            labelClass='form__group-label'
          />
          <InputField
            form={form}
            name='accFullName'
            label='Họ tên'
            labelClass='form__group-label'
          />
          <InputField
            form={form}
            name='accPhoneNumber'
            label='Số điện thoại'
            labelClass='form__group-label'
          />
          <input type='submit' className='signUp__button' value='Đăng ký' />
          <p className='signUp__res'>
            Đã có tài khoản? <span onClick={directSignIn}>Đăng nhập ngay</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
