import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

InprocessItem.propTypes = {
  url: PropTypes.string,
  name: PropTypes.number,
  price: PropTypes.string,
  timeLeft: PropTypes.string,
};

function InprocessItem({
  url = '',
  name = 'Sản phẩm đấu giá',
  price = '',
  timeLeft = 'Chưa có dữ liệu',
  prodId
}) {

  const history = useHistory()

  function handleClickDetail() {
    history.push(`/detail/${prodId}`)
  }
  return (

    <div className='seller__item'>
      <div
        className='seller__item-img'
        style={{ backgroundImage: `url(${url})` }}
      />
      <p className='seller__item-name' title={name}>
        {name}
      </p>
      <br />
      <p className='seller__item-price'>
        Giá: <span>${price}</span>
      </p>
      <p className='seller__item-time'>
        Còn lại: <span>{timeLeft}</span>
      </p>
      <button className='seller__item-btn seller__item-btn--detail' onClick={handleClickDetail}>Xem chi tiết</button>
    </div>
  );
}

export default InprocessItem;
