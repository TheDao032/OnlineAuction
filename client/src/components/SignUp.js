import { Axios } from 'axios';
import React, { useState } from 'react';
import '../asset/css/SignUp.css';

function SignUp() {
  const url = '';

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  function submit(e) {
    e.prevenDefault();
    // Axios.post(url,{
    //     name: data.name,
    //     email: data.email,
    //     password: data.password,
    //     phone: data.phone
    // })
    // .then(res => {
    //     console.log(res.data);
    // })

    console.log('data ne`', data);
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    console.log('du lieu nguoi dung` nhap la`', newData);
  }

  return (
    <div className='form_div1'>
      <form className='main'>
        <h1>Sign Up</h1>

        <div className='un'>
          <input
            onChange={(e) => handle(e)}
            id='name'
            type='text'
            placeholder='Name *'
            required
          />
        </div>

        <div className='em'>
          <input
            onChange={(e) => handle(e)}
            id='email'
            type='email'
            placeholder='E-mail *'
            required
          />
        </div>

        <div className='orp'>
          <input
            onChange={(e) => handle(e)}
            id='password'
            type='password'
            placeholder='Password *'
            required
          />
        </div>

        <div className='un'>
          <input
            onChange={(e) => handle(e)}
            id='phone'
            type='number'
            placeholder='Phone *'
            required
          />
        </div>

        <button onSubmit={(e) => submit(e)} type='submit'>
          Sign Up
        </button>
        {/* <h5>Have an Account? <a href="#"> Log In Here</a></h5> */}
        <hr />
        <h4>Or Register With</h4>

        {/* <div className="icons">
                <div className="icon-container">
                    <a href="https://elzero.org/" target="_blank">
                        <i className="fab fa-facebook-f" />
                    </a>
                </div>
                <div className="icon-container">
                    <a href="https://elzero.org/" target="_blank">
                        <i className="fab fa-twitter" />
                    </a>
                </div>
                <div className="icon-container">
                    <a href="https://github.com/PhilopaterHany" target="_blank">
                        <i className="fab fa-github" />
                    </a>
                </div>
            </div> */}
      </form>
    </div>
  );
}

export default SignUp;
