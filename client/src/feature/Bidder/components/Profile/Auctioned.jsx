import React from 'react';
import PropTypes from 'prop-types';
import formatCurrency from '../../../../util/formatCurrency'
import formatTime from '../../../../util/formatTime'

Auctioned.propTypes = {};

function Auctioned(props) {
  return (
    <div className='auctioned'>
      <div className='profile__title'>
        <p className='profile__title-main'>Sản phẩm đang đấu giá</p>
        <p className='profile__title-sub'>
          Đấu giá để dành quyền sở hữu
        </p>
        <hr />
      </div>
      <AuctionedItem />
      <AuctionedItem />
      <AuctionedItem />
      <AuctionedItem />
      <AuctionedItem />
      <AuctionedItem />
      <AuctionedItem />

    </div>
  );
}

function AuctionedItem({ }) {
  const { days, hours, mins } = formatTime('2021-10-30 22:23:12');
  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime('2021-10-30 22:23:12');

  return (
    <div className="auctioned__item">
      <div className='auctioned__image' style={{ backgroundImage: `url('https://images.fpt.shop/unsafe/fit-in/585x390/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2020/9/19/637361523937032025_Apple%C2%A0Watch%20SE%20GPS%C2%A040mm-hong-2.png')` }}></div>
      <div className='auctioned__info'>
        <p className='auctioned__seller'>
          Người bán: Nguyễn Thế Đạo
        </p>
        <p className='auctioned__timeStart'>
          Đăng lúc: {' '}
          {daysSell > 0
            ? `${daysSell} ngày trước`
            : hours > 0
              ? `${hoursSell} giờ trước`
              : `${minSell} phút trước`}
        </p>
        <h3 className='auctioned__name'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum velit blanditiis a officiis similique perspiciatis esse! Sit voluptatum numquam rerum cupiditate aut voluptatem laboriosam minima temporibus consequatur perferendis ea laudantium, magnam harum reiciendis rem dignissimos. Placeat veritatis nobis tenetur eos quod cum accusamus, facilis eligendi esse dignissimos sed odio adipisci?</h3>
        <p className='auctioned__price'>
          Giá hiện tại: {formatCurrency(201231293)}
        </p>
        <button className='auctioned__detail'>Xem chi tiết</button>
      </div>
    </div>
  )
}

export default Auctioned;
