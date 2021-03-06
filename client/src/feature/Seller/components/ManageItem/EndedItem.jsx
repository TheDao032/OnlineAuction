import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import swal from 'sweetalert'
import { setLoading } from '../../../../redux/actions/loadingAction'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'

EndedItem.propTypes = {
  url: PropTypes.string,
};

function Button({ suffix, onClick, children }) {
  return (
    <button className={`seller__item-btn seller__item-btn--${suffix}`} onClick={onClick}>{children}</button>
  )
}

function EndedItem({ url, name, winner = {}, prodId }) {
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
    cmtVote: 0, //0: k like k dislike, 1: like, -1: dislike
    cmtContent: '',
    prodId,
    toId: winner?.accId

  })

  const { user: { accessToken } } = useSelector(state => state.currentUser)
  const dispatch = useDispatch()


  function handleOpenComment() {
    if (isOpen) {
      setData({ ...data, cmtContent: '' })
    }
    setIsOpen(!isOpen)
  }

  function handleLike() {
    if (like.isLike) {
      like.likeCount -= 1
      setLike({ ...like, isLike: false })
      setData({ ...data, cmtVote: 0 })
    }
    else if (dislike.isDislike) {
      like.likeCount += 1
      dislike.dislikeCount -= 1
      setLike({ ...like, isLike: true })
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, cmtVote: 1 })

    }
    else {
      like.likeCount += 1
      setLike({ ...like, isLike: true })
      setData({ ...data, cmtVote: 1 })

    }
  }

  function handleDislike() {
    if (dislike.isDislike) {
      dislike.dislikeCount -= 1
      setDislike({ ...dislike, isDislike: false })
      setData({ ...data, cmtVote: 0 })
    }
    else if (like.isLike) {
      like.likeCount -= 1
      dislike.dislikeCount += 1
      setLike({ ...like, isLike: false })
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, cmtVote: -1 })

    }
    else {
      dislike.dislikeCount += 1
      setDislike({ ...dislike, isDislike: true })
      setData({ ...data, cmtVote: -1 })
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target
    console.log(name, value);

    setData({ ...data, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()


    if (data.cmtVote === 0)
      return swal("Th???t b???i", "Vui l??ng like ho???c dislike!", "error");

    if (data.comment === '' || data.comment === undefined) {
      return swal("Th???t b???i", "Vui l??ng ghi nh???n x??t!", "error");
    }
    const reqBody = {
      cmtVote: data.cmtVote,
      cmtContent: data.comment,
      prodId: data.prodId,
      toId: data.toId
    }
    try {
      dispatch(setLoading(true))

      const res = await axios.post('https://onlineauctionserver.herokuapp.com/api/comment/new-comment', reqBody, {
        headers: {
          authorization: accessToken
        }
      })

      dispatch(setLoading(false))
      console.log(res)
      swal("Th??nh c??ng", "???? nh???n x??t bidder th??nh c??ng", "success");

    } catch (error) {
      console.log(error.response)
      dispatch(setLoading(false))
      swal("Th???t b???i", "C?? l???i khi nh???n x??t bidder, vui l??ng th??? l???i", "error");
    }
    console.log("Data: ", reqBody)
  }

  function handleCancel(e) {
    e.preventDefault()
    const cancelData = {
      cmtVote: -1,
      cmtContent: 'Ng?????i th???ng kh??ng thanh to??n'
    }
    swal("Th??nh c??ng", "???? huy giao d???ch!", "success");
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
    <p className='seller__item-winner'>Ng?????i th???ng: <span>{winner.accName === null ? 'Unknow Seller' : winner?.accName}</span></p>
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
        <label for='comment' className='seller__item-comment-label' onClick={handleOpenComment}>Nh???n x??t</label>
      </div>
      {
        isOpen && <input id='comment' name='comment' className='seller__item-comment' onChange={handleOnChange}
          placeholder='Nh???n x??t c???a b???n..' />
      }
      <div className='seller__item-action'>
        {data.cmtVote === 1 || data.cmtVote === -1 || data.cmtContent !== ''
          ? <Button suffix='save' onClick={handleSubmit}>L??u</Button>
          : ''
        }
        <Button suffix='cancel' onClick={handleCancel}>H???y giao d???ch</Button>
      </div>
    </form>
  </div>;
}

export default EndedItem;
