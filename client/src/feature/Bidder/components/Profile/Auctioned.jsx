import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import formatCurrency from "../../../../util/formatCurrency";
import formatTime from "../../../../util/formatTime";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../../redux/actions/loadingAction";
import axios from "axios";
import Empty from "../../../../components/Empty/Empty";
import { imagePlaceholder } from "../../../../util/imagePlaceholder";
import { useHistory } from "react-router";

Auctioned.propTypes = {};

function Auctioned(props) {
  const dispatch = useDispatch();
  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const [auctionList, setAuctionList] = useState([]);

  async function getAuctionItemList() {
    try {
      dispatch(setLoading(true));

      const res = await axios.get(
        "https://onlineauctionserver.herokuapp.com/api/bidder/attend-auction",
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      dispatch(setLoading(false));
      setAuctionList(res.data.listProducts);
      console.log(res.data.listProducts);
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  useEffect(() => {
    getAuctionItemList();
  }, []);

  return (
    <div className="auctioned">
      <div className="profile__title">
        <p className="profile__title-main">Sản phẩm đang đấu giá</p>
        <p className="profile__title-sub">Đấu giá để dành quyền sở hữu</p>
        <hr />
      </div>

      {auctionList.length === 0 ? (
        <Empty />
      ) : (
        auctionList.map((item) => {
          return (
            <AuctionedItem
              src={
                item.prodImages === undefined || item.prodImages?.length === 0
                  ? imagePlaceholder
                  : item.prodImages[0].prodImgSrc
              }
              seller={
                item.seller.accName === null || item.seller.accName === ""
                  ? item.seller.accEmail
                  : item.seller.accName
              }
              createDate={item.createDate}
              name={item.prodName}
              beginPrice={item.prodBeginPrice}
              currentPrice={
                item.prodOfferNumber === null || item.prodOfferNumber === 0
                  ? item.prodBeginPrice
                  : item.prodBeginPrice +
                    (item.prodOfferNumber + item.prodStepPrice)
              }
              prodId={item.prodId}
            />
          );
        })
      )}
    </div>
  );
}

function AuctionedItem({
  src,
  seller,
  createDate,
  name,
  beginPrice,
  currentPrice,
  prodId,
}) {
  const { days, hours, mins } = formatTime(createDate);
  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(createDate);

  console.log(createDate);
  console.log(formatTime(createDate));

  const history = useHistory();

  function handleClickDetail() {
    history.push(`/detail/${prodId}`);
  }

  return (
    <div className="auctioned__item">
      <div
        className="auctioned__image"
        style={{
          backgroundImage: `url(${src})`,
        }}
        onClick={handleClickDetail}
      ></div>
      <div className="auctioned__info">
        <p className="auctioned__seller">Người bán: {seller}</p>
        <p className="auctioned__timeStart">
          Đăng lúc:{" "}
          {/* {daysSell > 0
            ? `${daysSell} ngày trước`
            : hours > 0
            ? `${hoursSell} giờ ${minSell} phút trước`
            : `${minSell} phút trước`} */}
          {`${Math.abs(daysSell)} ngày ${Math.abs(hoursSell)} giờ trước`}
        </p>
        <h3 className="auctioned__name">{name}</h3>

        <p className="auctioned__price">
          Giá khởi đầu: {formatCurrency(beginPrice)}
        </p>
        <p className="auctioned__price">
          Giá hiện tại: {formatCurrency(currentPrice)}
        </p>

        <button className="auctioned__detail" onClick={handleClickDetail}>
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default Auctioned;
