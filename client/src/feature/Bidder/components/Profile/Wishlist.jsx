import React from 'react';
import PropTypes from 'prop-types';
import formatCurrency from '../../../../util/formatCurrency'
import formatTime from '../../../../util/formatTime'

Wishlist.propTypes = {};

function Wishlist(props) {
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
    <WishListItem />
    <WishListItem />
    <WishListItem />
    <WishListItem />
    <WishListItem />
  </div>;
}

function WishListItem({ }) {
  const { days, hours, mins } = formatTime('2021-10-30 22:23:12');
  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime('2021-10-30 22:23:12');

  return (
    <div className="wishlist__item">
      <div className='wishlist__image' style={{ backgroundImage: `url('https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png')` }}></div>
      <div className='wishlist__info'>
        <p className='wishlist__seller'>
          Người bán: Nguyễn Thế Đạo
        </p>
        <p className='wishlist__timeStart'>
          Đăng lúc: {' '}
          {daysSell > 0
            ? `${daysSell} ngày trước`
            : hours > 0
              ? `${hoursSell} giờ trước`
              : `${minSell} phút trước`}
        </p>
        <h3 className='wishlist__name'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum velit blanditiis a officiis similique perspiciatis esse! Sit voluptatum numquam rerum cupiditate aut voluptatem laboriosam minima temporibus consequatur perferendis ea laudantium, magnam harum reiciendis rem dignissimos. Placeat veritatis nobis tenetur eos quod cum accusamus, facilis eligendi esse dignissimos sed odio adipisci?</h3>
        <p className='wishlist__price'>
          Giá hiện tại: {formatCurrency(201231293)}
        </p>
        <button className='wishlist__detail'>Xem chi tiết</button>
      </div>
    </div>
  )
}

export default Wishlist;
