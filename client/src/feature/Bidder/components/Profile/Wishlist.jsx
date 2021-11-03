import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from '../../../../util/formatCurrency'
import formatTime from '../../../../util/formatTime'
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert'
import { setLoading } from '../../../../redux/actions/loadingAction';
import axios from 'axios';
import {
  AiFillHeart
} from 'react-icons/ai';
import { useHistory } from 'react-router';
Wishlist.propTypes = {};

function Wishlist(props) {
  const dispatch = useDispatch()
  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const [wish, setWish] = useState([])

  const getWatchList = async () => {
    dispatch(setLoading(true))
    try {
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/watch-list/list', {
        headers: {
          authorization: accessToken,
        },
      })

      if (!res.data.errorMessage) {
        setWish(res.data?.listWatch)
      }
      console.log(res.data?.listWatch)

      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.response);
    }
  }

  useEffect(() => {
    getWatchList()
  }, [])

  const handleRemove = async (watchId) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/watch-list/delete',
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      // console.log(res);
      dispatch(setLoading(false));

      swal('Thành công!', 'Đã xóa khỏi danh sách yêu thích!', 'success');
      getWatchList()

    } catch (err) {
      console.log(err.response);
      dispatch(setLoading(false));

      swal(
        'Thất bại!',
        'Có lỗi khi xóa sản phẩm khỏi yêu thích, vui lòng thử lại!',
        'error'
      );
    }
  }

  return <div className='wishlist'>
    <div className='profile__title'>
      <p className='profile__title-main'>
        Danh sách yêu thích
      </p>
      <p className='profile__title-sub'>
        Lưu giữ sản phẩm yêu thích cho lần đấu giá tiếp theo
      </p>
      <hr />
    </div>
    {wish.map(item => {
      return (
        <WishListItem
          prodId={item.prodId}
          name={item.prodName}
          expireDate={item.expireDate}
          currentPrice={item.prodOfferNumber === null ? item.prodBeginPrice : item.prodBeginPrice + item.prodOfferNumber * item.prodStepPrice}
          handleRemove={handleRemove}
          watchId={item.watchId}
        />
      )
    })}
  </div>;
}

function WishListItem({ watchId, prodId, name, expireDate, currentPrice, handleRemove }) {
  const { days, hours, mins } = formatTime(expireDate);
  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(expireDate);

  const history = useHistory()

  function handleClickDetail() {
    history.push(`/detail/${prodId}`)
  }

  function handleRemoveItem() {
    if (!handleRemove) return
    handleRemove(watchId)
  }

  return (
    <div className="wishlist__item">
      <div className='wishlist__image' style={{ backgroundImage: `url('https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png')` }}></div>
      <div className='wishlist__info'>
        <p className='wishlist__timeStart'>
          Đăng lúc: {' '}
          {daysSell > 0
            ? `${daysSell} ngày trước`
            : hours > 0
              ? `${hoursSell} giờ trước`
              : `${minSell} phút trước`}
        </p>
        <h3 className='wishlist__name'>{name}</h3>
        <p className='wishlist__price'>
          Giá hiện tại: {formatCurrency(currentPrice)}
        </p>
        <div className='wishlist__action'>
          <button className='wishlist__detail' onClick={handleClickDetail}>Xem chi tiết</button>
          <button className='wishlist__remove' onClick={handleRemoveItem}>
            <AiFillHeart />
            <p>
              Gỡ khỏi yêu thích
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wishlist;
