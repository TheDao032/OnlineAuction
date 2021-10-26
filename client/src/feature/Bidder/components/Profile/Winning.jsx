import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import swal from 'sweetalert';

Winning.propTypes = {
  url: PropTypes.string,
};

function Button({ suffix, onClick, children }) {
  return (
    <button
      className={`winning__item-btn winning__item-btn--${suffix}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Winning() {
  return (
    <>
      <div className='profile__title'>
        <p className='profile__title-main'>Sản phẩm đã thắng</p>
        <p className='profile__title-sub'>Chúa tể ra giá, kẻ chiếm lĩnh thị trường</p>
        <hr />
      </div>
      <div className='winning__container'>
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
        <WinningItem url='https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png' name='Apple Watch nè' />
      </div>
    </>
  );
}

function WinningItem({ url, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const [like, setLike] = useState({
    isLike: false,
    likeCount: 0,
  });
  const [dislike, setDislike] = useState({
    isDisike: false,
    dislikeCount: 0,
  });
  const [data, setData] = useState({
    status: 0, //0: k like k dislike, 1: like, -1: dislike
    comment: '',
  });

  function handleOpenComment() {
    if (isOpen) {
      setData({ ...data, comment: '' });
    }
    setIsOpen(!isOpen);
  }

  function handleLike() {
    if (like.isLike) {
      like.likeCount -= 1;
      setLike({ ...like, isLike: false });
      setData({ ...data, status: 0 });
    } else if (dislike.isDislike) {
      like.likeCount += 1;
      dislike.dislikeCount -= 1;
      setLike({ ...like, isLike: true });
      setDislike({ ...dislike, isDislike: false });
      setData({ ...data, status: 1 });
    } else {
      like.likeCount += 1;
      setLike({ ...like, isLike: true });
      setData({ ...data, status: 1 });
    }
  }

  function handleDislike() {
    if (dislike.isDislike) {
      dislike.dislikeCount -= 1;
      setDislike({ ...dislike, isDislike: false });
      setData({ ...data, status: 0 });
    } else if (like.isLike) {
      like.likeCount -= 1;
      dislike.dislikeCount += 1;
      setLike({ ...like, isLike: false });
      setDislike({ ...dislike, isDislike: true });
      setData({ ...data, status: -1 });
    } else {
      dislike.dislikeCount += 1;
      setDislike({ ...dislike, isDislike: true });
      setData({ ...data, status: -1 });
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    console.log(name, value);

    setData({ ...data, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log('Data: ', data);
  }

  console.log(url)
  return (
    <div className='winning__item ended-item'>
      <div
        className='winning__item-img'
        style={{ backgroundImage: `url('${url}')` }}
      />
      <p className='winning__item-name' title={name}>
        {name}
      </p>
      <br />
      <p className='winning__item-winner'>
        Người bán: <span>Bùi Hồng Ân</span>
      </p>
      <form className='winning__item-form'>
        <div className='winning__item-react'>
          <div className='winning__item-like' onClick={handleLike}>
            <AiFillLike style={like.isLike && { color: '#3c99dc' }} />
            <span>{like.likeCount}</span>
          </div>
          <div className='winning__item-dislike' onClick={handleDislike}>
            <AiFillDislike
              style={dislike.isDislike && { color: '#3c99dc' }}
            />
            <span>{dislike.dislikeCount}</span>
          </div>
          <label
            for='comment'
            className='winning__item-comment-label'
            onClick={handleOpenComment}
          >
            Nhận xét
          </label>
        </div>
        {isOpen && (
          <input
            id='comment'
            name='comment'
            className='winning__item-comment'
            onChange={handleOnChange}
            placeholder='Nhận xét của bạn..'
          />
        )}
        <div className='winning__item-action'>
          {data.status === 1 || data.status === -1 || data.comment !== '' ? (
            <Button suffix='save' onClick={handleSubmit}>
              Lưu
            </Button>
          ) : (
            ''
          )}
        </div>
      </form>
    </div>)
}

export default Winning;
