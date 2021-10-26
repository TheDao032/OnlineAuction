import React from 'react';
import PropTypes from 'prop-types';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

Rating.propTypes = {};

function Rating(props) {
  return <div className='rating'>
    <div className='profile__title'>
      <p className='profile__title-main'>
        Đánh giá của bạn
      </p>
      <p className='profile__title-sub'>
        Đánh giá cho biết độ uy tín của bạn
      </p>
      <hr />
    </div>
    <div className='rating__general'>
      <h3>Đánh giá của bạn:</h3>
      <div className='rating__general-rate'>
        <p>
          10 <AiFillLike className='rating__general-like' /> và 31 <AiFillDislike className='rating__general-dislike' /> ({(10 * 100 / (10 + 31)).toFixed(2)}%)
        </p>
      </div>
    </div>
    <div className="rating__detail">
      <h3>Chi tiết đánh giá</h3>
      <div className="rating__box">
        <RatingItem />
        <RatingItem />
        <RatingItem />
        <RatingItem />
        <RatingItem />
      </div>
    </div>
  </div>;
}

function RatingItem() {
  return (
    <div className='rating__item'>
      <p className="rating__name">Nguyễn Thế Đạo cho bạn <AiFillLike /></p>
      <p className="rating__comment">
        Nhận xét: Đỉnh cao bán hàng, chúa tể đấu giá.
      </p>

    </div>
  )
}

export default Rating;
