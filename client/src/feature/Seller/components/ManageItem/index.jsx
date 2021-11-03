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
        setInprocessProduct({ isActive: true, product: res.data.listProducts.filter(item => formatTime(item.expireDate).days >= 0) })
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
    setExpiredProduct({ ...expiredProduct, isActive: true, product: product.filter(item => formatTime(item.expireDate).days < 0) })
    setInprocessProduct({ isActive: false })
  }

  console.log(product)

  function handleGetItemProcess() {
    console.log('In process item')
    setExpiredProduct({ isActive: false })
    setInprocessProduct({ ...inprocessProduct, isActive: true, product: product.filter(item => formatTime(item.expireDate).days >= 0) })
  }


  return <div className='seller__manage'>
    <div className='seller__menu'>
      <Button onClick={handleGetItemProcess} suffix='process' active={inprocessProduct.isActive}>Đang diễn ra</Button>
      <Button onClick={handleGetItemEnded} suffix='ended' active={expiredProduct.isActive}>Đã kết thúc</Button>
    </div>
    <div className='seller__container'>
      {
        expiredProduct.isActive ? expiredProduct.product.map(item => {
          return <EndedItem url={item.prodImages[0]?.prodImgSrc}
            name={item.prodName}
            winner={item.biggestBidder !== null ? item.biggestBidder : {}}
            prodId={item.prodId}
          />
        }) : inprocessProduct.product.map(item => {
          if (item.prodOfferNumber === null) {
            item.prodOfferNumber = 0
          }
          const objTime = formatTime(item.expireDate)
          let timeLeftLabel = ''
          console.log(formatTime(item.expireDate))
          if (objTime.days < 0) {
            if (objTime.hours < 0) {
              timeLeftLabel = `${objTime.mins} phút`
            }
            else {
              timeLeftLabel = `${objTime.hours} giờ ${objTime.mins} phút`
            }
          }
          else {
            timeLeftLabel = `${objTime.days} ngày ${objTime.hours} giờ ${objTime.mins} phút`
          }

          return <InprocessItem url={item.prodImages[0]?.prodImgSrc}
            name={item.prodName}
            price={item.prodBeginPrice + item.prodOfferNumber * item.prodStepPrice}
            timeLeft={timeLeftLabel}
            prodId={item.prodId}
          />
        })
      }


    </div>
  </div>;
}

export default ManageItem;
