import React from 'react';
import PropTypes from 'prop-types';

InprocessItem.propTypes = {
  url: PropTypes.string,
  name: PropTypes.number,
  price: PropTypes.string,
  timeLeft: PropTypes.string,
  onClick: PropTypes.func,
};

function InprocessItem({
  url = '',
  name = 'Sản phẩm đấu giá',
  price = '',
  timeLeft = 'Chưa có dữ liệu',
  onClick = null,
}) {
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
      <button className='seller__item-btn seller__item-btn--detail'>Xem chi tiết</button>
    </div>
  );
}

export default InprocessItem;
