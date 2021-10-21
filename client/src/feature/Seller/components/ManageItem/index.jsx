import React from 'react';
import PropTypes from 'prop-types';
import InprocessItem from './InprocessItem';
import EndedItem from './EndedItem';

ManageItem.propTypes = {};

function Button({ suffix, onClick, children }) {
  return (
    <button className={`seller__btn seller__btn-${suffix}`} onClick={onClick}>{children}</button>
  )
}

function ManageItem(props) {
  function handleGetItemEnded() {
    console.log('ended item')
  }

  function handleGetItemProcess() {
    console.log('In process item')
  }

  return <div className='seller__manage'>
    <div className='seller__menu'>
      <Button onClick={handleGetItemProcess} suffix='process' >Đang diễn ra</Button>
      <Button onClick={handleGetItemEnded} suffix='ended'>Đã kết thúc</Button>
    </div>
    <div className='seller__container'>
      {/* <InprocessItem url='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI='
        name='Apple Watch series 7 mại dô mọi người ơiiiii mua về mà xài nè'
        price='600'
        timeLeft='1 giờ 20 phút'
      /> */}
      <EndedItem url='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI='
        name='Apple Watch series 7 mại dô mọi người ơiiiii mua về mà xài nè' />
    </div>
  </div>;
}

export default ManageItem;
