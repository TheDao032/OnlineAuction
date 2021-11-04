import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setLoading } from "../../../../redux/actions/loadingAction";
import "./ListPermission.scss";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Loading from '../../../../components/Loading/Loading'
import formatCurrency from '../../../../util/formatCurrency'
import getFullDay from '../../../../util/getFullDay'

ListPermission.propTypes = {};

function ListPermission(props) {
  const dispatch = useDispatch();
  const { prodId } = useParams();

  const loadingState = useSelector(state => state.loading)

  const [listPermission, setListPermission] = useState([])
  const [listAuction, setListAuction] = useState([])


  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  async function getListPermission() {
    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        " https://onlineauctionserver.herokuapp.com/api/seller/list-permission",
        {
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      dispatch(setLoading(false));
      console.log(res.data);
      setListPermission(res.data.listPermission)
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  async function getListAuction() {
    dispatch(setLoading(true));
    try {

      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/auction/list-auction",
        {
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      dispatch(setLoading(false));
      console.log(res.data);
      setListAuction(res.data.listAuctions)
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  useEffect(() => {
    getListPermission();
    getListAuction()
  }, []);

  console.log(loadingState)
  return (
    <>
      {loadingState.loading ? <Loading /> :
        <div className="listPermission">
          <h1 className="listPermission__title">Danh sách chờ cho quyền</h1>
          {/* <hr /> */}
          <div className='listPermission__list'>
            {
              listPermission.length === 0
                ? <p className="listPermission__empty">Chưa có bidder nào đang chờ cấp quyền</p>
                : listPermission.map(item => {
                  return (
                    <ListPermissionItem name={item.perBidderName === '' ? item.perBidderEmail : item.perBidderName} />
                  )
                })
            }
          </div>
          <hr />
          <h1 className="listPermission__title">Danh sách người đấu giá sản phẩm</h1>
          <div className='listPermission__list'>
            {
              listAuction.length === 0
                ? <p className="listPermission__empty">Chưa có bidder nào đấu giá sản phẩm này</p>
                : listAuction.map(item => {
                  return (
                    <ListAuctionItem
                      name={item.sttBidderName === null ? item.sttBidderEmail : item.perBidderName}
                      price={item.sttBiggestPrice}
                      time={item.createdDate}
                    />
                  )
                })
            }
          </div>
        </div>
      }
    </>
  );
}

function ListPermissionItem({ name }) {
  return (
    <div className='listPermission__item'>
      <h6 className='listPermission__item-name'>Bidder: <span>{name}</span> muốn đấu giá sản phẩm này</h6>
      <div className='listPermission__item-action'>
        <button className='listPermission__item-btn listPermission__item-btn--yes'>
          <AiOutlineCheck />
          <p>Đồng ý</p>
        </button>
        <button className='listPermission__item-btn listPermission__item-btn--no'>
          <AiOutlineClose />
          <p>Từ chối</p>
        </button>
      </div>
    </div>
  )
}

function ListAuctionItem({ name, price, time }) {
  return (
    <div className='listPermission__item'>
      <h6 className='listPermission__item-name'>Bidder: <span>{name}</span> đấu giá sản phẩm với giá <span>{formatCurrency(price)}</span> lúc <span>{`${getFullDay(time.split(' ')[0])} - ${(time.split(' ')[1])}`}</span></h6>
      <div className='listPermission__item-action'>
        <button className='listPermission__item-btn listPermission__item-btn--no'>
          <AiOutlineClose />
          <p>Từ chối</p>
        </button>
      </div>
    </div>
  )
}

export default ListPermission;
