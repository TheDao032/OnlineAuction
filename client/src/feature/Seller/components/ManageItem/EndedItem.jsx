import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import swal from 'sweetalert'

EndedItem.propTypes = {
  url: PropTypes.string,
};

function Button({ suffix, onClick, children }) {
  return (
    <button className={`seller__item-btn seller__item-btn--${suffix}`} onClick={onClick}>{children}</button>
  )
}

function EndedItem({ url, name }) {
  const [isOpen, setIsOpen] = useState(false)
  const [like, setLike] = useState({
    isLike: false,
    likeCount: 0
  })
  const [dislike, setDislike] = useState({
    isDisike: false,
    dislikeCount: 0
  })
  const [data, setData] = useState({
    status: 0, //0: k like k dislike, 1: like, -1: dislike
    comment: ''
  })

  function handleOpenComment() {
    if (isOpen) {
      setData({ ...data, comment: '' })
    }
    setIsOpen(!isOpen)
  }

  function handleLike() {
    if (like.isLike) {
      like.likeCount -= 1
      setLike({ ...like, isLike: false })
      setData({ ...data, status: 0 })
    }
    else if (dislike.isDislike) {
      like.likeCount += 1
      dislike.dislikeCount -= 1
      setLike({ ...like, isLike: true })
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, status: 1 })

    }
    else {
      like.likeCount += 1
      setLike({ ...like, isLike: true })
      setData({ ...data, status: 1 })

    }
  }

  function handleDislike() {
    if (dislike.isDislike) {
      dislike.dislikeCount -= 1
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, status: 0 })
    }
    else if (like.isLike) {
      like.likeCount -= 1
      dislike.dislikeCount += 1
      setLike({ ...like, isLike: false })
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, status: -1 })

    }
    else {
      dislike.dislikeCount += 1
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, status: -1 })
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target
    console.log(name, value);

    setData({ ...data, [name]: value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    console.log("Data: ", data)
  }

  function handleCancel(e) {
    e.preventDefault()
    const cancelData = {
      status: -1,
      comment: 'Người thắng không thanh toán'
    }
    swal("Thành công", "Đã huy giao dịch!", "success");
    console.log(cancelData)
  }

  return <div className='seller__item ended-item'>
    <div
      className='seller__item-img'
      style={{ backgroundImage: `url(${url})` }}
    />
    <p className='seller__item-name' title={name}>
      {name}
    </p>
    <br />
    <p className='seller__item-winner'>Người thắng: <span>Bùi Hồng Ân</span></p>
    <form className='seller__item-form'>
      <div className='seller__item-react'>
        <div className='seller__item-like' onClick={handleLike}>
          <AiFillLike style={like.isLike && { color: '#3c99dc' }} />
          <span>{like.likeCount}</span>
        </div>
        <div className='seller__item-dislike' onClick={handleDislike}>
          <AiFillDislike style={dislike.isDislike && { color: '#3c99dc' }} />
          <span>{dislike.dislikeCount}</span>
        </div>
        <label for='comment' className='seller__item-comment-label' onClick={handleOpenComment}>Nhận xét</label>
      </div>
      {
        isOpen && <input id='comment' name='comment' className='seller__item-comment' onChange={handleOnChange}
          placeholder='Nhận xét của bạn..' />
      }
      <div className='seller__item-action'>
        {data.status === 1 || data.status === -1 || data.comment !== ''
          ? <Button suffix='save' onClick={handleSubmit}>Lưu</Button>
          : ''
        }
        <Button suffix='cancel' onClick={handleCancel}>Hủy giao dịch</Button>
      </div>
    </form>
  </div>;
}

export default EndedItem;
