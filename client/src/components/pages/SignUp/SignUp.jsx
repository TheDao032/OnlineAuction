import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import '../../../asset/css/SignUp.css';
import InputField from '../../formComtrol/inputField';
import PasswordField from '../../formComtrol/passwordField';
import { setLoading } from '../../../redux/actions/loadingAction';
import Loading from '../../Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';


import './SignUp.scss';

function SignUp() {
  const dispatch = useDispatch()
  const loadingState = useSelector(state => state.loading)
  const history = useHistory();
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
      "accEmail": data.accEmail.toString(),
      "accPassword": data.accPassword.toString(),
      "accFullName": data.accFullName.toString(),
      "accPhoneNumber": data.accPhoneNumber.toString(),
    }

    dispatch(setLoading(true))
    try {
      const res = await axios
        .post(
          'https://onlineauctionserver.herokuapp.com/api/authentication/register',
          postData
        )
      setErr('')
      console.log("Response", res);
      dispatch(setLoading(false))
      swal("Thành công!", "Đăng ký thành công!", "success")
        .then(() => {
          history.push('/sign-in')
        });
    } catch (error) {
      console.log(error.response)
      let errMess = error.response.data.errorMessage
      if (errMess === 'Email Has Already Existed') errMess = 'Tài khoản đã tồn tại'
      else if (errMess.startsWith('must')) {
        errMess = 'Thử với email khác'
      }
      setErr(errMess)
      dispatch(setLoading(false))
      swal("Thất bại!", "Có lỗi xảy ra, vui lòng thử lại!", "error")
    }

  };

  console.log('tải ', loadingState);


  return (
    <>
      {loadingState.loading
        ? <Loading />
        : <div className='signUp'>
          <div className='signUp__container'>
            <h2>ĐĂNG KÝ</h2>
            <hr />
            {err !== '' && <p className='signUp__noti'>{err}</p>}
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
      }
    </>
  );
}

export default SignUp;
