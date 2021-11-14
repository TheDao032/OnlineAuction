import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import Loading from '../../../../components/Loading/Loading';
import formatCurrency from '../../../../util/formatCurrency';
import getTimeLeft from '../../../../util/getTimeLeft';


AdminProduct.propTypes = {};

const deleteCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#ff7b7b',
  marginRight: '8px',
  color: '#333'
}

const editCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#48bf91',
  marginRight: '8px',
  color: '#333'
}

function AdminProduct(props) {
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  async function getAllProduct() {
    try {
      setLoading(true)
      const res = await axios.get('https://onlineauctionserver.herokuapp.com/api/product/list')
      console.log(res.data.listProducts)
      setProduct(res.data.listProducts)
      setLoading(false)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  const handleDelete = (id) => {
    console.log('remove')
  }


  return (
    <>
      {loading
        ? <Loading />
        :
        <section className='admin'>
          <div className='tbl-header'>
            <table className='admin__table'>
              <thead className='admin__thead'>
                <tr className='admin__tr admin__tr--product'>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Begin Price</th>
                  <th>Offer Amount</th>
                  <th>Day end</th>
                  <th>
                    <button className='admin-add-category-btn' onClick={() => { history.push('/seller/create-post') }}>Add</button>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className='tbl-content'>
            <table className='admin__table'>
              <tbody className='admin__tbody'>
                {product.map((item) => {
                  const { days, hours, mins } = getTimeLeft(item.expireDate)
                  return (
                    <tr className='admin__tr admin__tr--product' key={item.prodId}>
                      <td>{item.prodId}</td>
                      <td title={item.prodName} style={{ cursor: 'pointer' }} onClick={() => history.push(`/detail/${item.prodId}`)}>
                        <p className='admin__td-name'>
                          {item.prodName}
                        </p>
                      </td>
                      <td>{formatCurrency(item.prodBeginPrice)}</td>
                      <td>{item.prodOfferNumber === null ? 0 : item.prodOfferNumber}</td>
                      <td>
                        {
                          days < 0 ? (
                            <p className='category__item-expire-end'>Đã hết hạn</p>
                          ) : days > 0 ? (
                            <p className='category__item-expire-still'>Còn: {days} ngày</p>
                          ) : hours <= 0 ? (
                            <p className='category__item-expire-still'>Còn: {mins} phút</p>
                          ) : (
                            <p className='category__item-expire-still'>Còn: {hours} giờ</p>
                          )
                        }
                      </td>
                      <td>
                        <div style={editCss} onClick={() => { }}>
                          <RiEditFill />
                        </div>
                        <div style={deleteCss} title='Delete' onClick={() => handleDelete(item.id)}>
                          <RiDeleteBin6Fill />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      }
    </>

  );
}

export default AdminProduct;
