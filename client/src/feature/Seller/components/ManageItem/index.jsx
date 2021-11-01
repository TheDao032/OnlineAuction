import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InprocessItem from './InprocessItem';
import EndedItem from './EndedItem';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../../redux/actions/loadingAction'
import { useHistory, } from 'react-router';
import swal from 'sweetalert';
import axios from 'axios';
import formatTime from '../../../../util/formatTime';

ManageItem.propTypes = {};

function Button({ suffix, onClick, children, active }) {
  return (
    <button className={`seller__btn seller__btn-${suffix} ${active ? 'seller__btn--active' : ''}`} onClick={onClick}>{children}</button>
  )
}

function ManageItem(props) {
  const loadingState = useSelector(state => state.loading)
  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const [product, setProduct] = useState([])
  const [expiredProduct, setExpiredProduct] = useState({
    isActive: false,
    product: []
  })
  const [inprocessProduct, setInprocessProduct] = useState(
    {
      isActive: true,
      product: []
    }
  )
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true))
        const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/seller/my-product', {
          headers: {
            authorization: accessToken,
          }
        })

        console.log(res)
        setProduct(res.data.listProducts)
        dispatch(setLoading(false))
      } catch (error) {
        console.log(error.response)
        dispatch(setLoading(false))
      }
    })()
  }, [])

  // TODO: Chia product ra làm 2 cái đã kết thúc và đang diễn ra




  function handleGetItemEnded() {
    console.log('ended item')
    setExpiredProduct({ ...expiredProduct, isActive: true })
    setInprocessProduct({ ...inprocessProduct, isActive: false })
  }

  function handleGetItemProcess() {
    console.log('In process item')
    setExpiredProduct({ ...expiredProduct, isActive: false })
    setInprocessProduct({ ...inprocessProduct, isActive: true })
  }


  return <div className='seller__manage'>
    <div className='seller__menu'>
      <Button onClick={handleGetItemProcess} suffix='process' active={inprocessProduct.isActive}>Đang diễn ra</Button>
      <Button onClick={handleGetItemEnded} suffix='ended' active={expiredProduct.isActive}>Đã kết thúc</Button>
    </div>
    <div className='seller__container'>
      {
        product.map(item => {
          // let expired = checkExpired(formatTime(item.expireDate).days)
          // if (expired) {

          // }
          // else {
          //   console.log('còn hạn')
          // }
        })
      }
      <InprocessItem url='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI='
        name='Apple Watch series 7 mại dô mọi người ơiiiii mua về mà xài nè'
        price='600'
        timeLeft='1 giờ 20 phút'
      />
      <EndedItem url='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI='
        name='Apple Watch series 7 mại dô mọi người ơiiiii mua về mà xài nè' />
    </div>
  </div>;
}

export default ManageItem;
