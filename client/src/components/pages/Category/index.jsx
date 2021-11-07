import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import Loading from "../../Loading/Loading";
import "./scss/index.scss";
import Empty from "../../Empty/Empty";
import { imagePlaceholder } from "../../../util/imagePlaceholder";
import formatTime from "../../../util/formatTime";
import getTimeLeft from "../../../util/getTimeLeft";
import formatCurrency from "../../../util/formatCurrency";
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiFillEdit,
} from "react-icons/ai";
import swal from "sweetalert";

function Category(props) {
  const { cateId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getProductByCate() {
    setLoading(true);

    try {
      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/product/list-with-cate",
        {
          cateId: +cateId,
        }
      );

      console.log(res.data.listProducts);
      setProduct(res.data.listProducts);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductByCate();
  }, [cateId]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="category grid wide">
          {product.length === 0 ? (
            <Empty title="Danh mục này chưa có sản phẩm" />
          ) : (
            <div className="category__container">
              {product.map((item) => {
                return (
                  <CategoryItem
                    src={
                      item.prodImages.length === 0 ||
                        item.prodImages[0] === undefined
                        ? imagePlaceholder
                        : item.prodImages[0].prodImgSrc
                    }
                    name={item.prodName}
                    prodId={item.prodId}
                    createDate={item.createDate}
                    loading={loading}
                    setLoading={setLoading}
                    buyNow={
                      item.prodBuyPrice === null || item.prodBuyPrice === "0"
                        ? 0
                        : item.prodBuyPrice
                    }
                    expireDate={item.expireDate}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function CategoryItem({
  src,
  name,
  createDate,
  prodId,
  loading,
  setLoading,
  buyNow,
  expireDate,
}) {
  const history = useHistory();
  const { days, mins, hours } = formatTime(createDate);

  prodId = parseInt(prodId);

  const [isLogin, setIsLogin] = useState(false);
  const [wishItem, setWishItem] = useState([]);
  const [wish, setWish] = useState({
    isWish: false,
    watchId: null,
  });

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);
  let { loggedIn } = useSelector((state) => state.currentUser);

  useEffect(() => {
    setIsLogin(loggedIn);
  }, [loggedIn]);

  async function getWatchList() {
    if (loggedIn) {
      try {
        const res = await axios.get(
          "https://onlineauctionserver.herokuapp.com/api/watch-list/list",
          {
            headers: {
              authorization: accessToken,
            },
          }
        );
        // console.log(res.data);
        if (!res.data.errorMessage) {
          setWishItem(res.data.listWatch);
        }
      } catch (error) {
        console.log("Danh sách Watch list lỗi: ", error.response);
      }
    }
  }

  useEffect(() => {
    getWatchList();
  }, []);

  useEffect(() => {
    const checkItem = () => {
      for (let i of wishItem) {
        if (prodId === i.prodId) {
          setWish({
            isWish: true,
            watchId: i.watchId,
          });
          return;
        }
      }
    };
    checkItem();
  }, [wishItem, prodId]);

  async function handleAddToWishList() {
    if (isLogin) {
      try {
        setLoading(true);
        const res = await axios.post(
          "https://onlineauctionserver.herokuapp.com/api/watch-list/add",
          {
            prodId,
          },
          { headers: { authorization: accessToken } }
        );

        setLoading(false);
        console.log(res);
        setWish({
          isWish: true,
          watchId: res.data.watchId,
        });

        swal("Thành công!", "Sản phẩm đã được thêm vào yêu thích!", "success");
      } catch (err) {
        console.log(err.response);
        setLoading(false);

        swal(
          "Thất bại!",
          "Có lỗi khi thêm sản phẩm vào yêu thích, vui lòng thử lại!",
          "error"
        );
      }
    } else {
      history.push("/sign-in");
    }
  }

  async function handleRemoveToWishList() {
    let { watchId } = wish;
    try {
      setLoading(true);

      const res = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/watch-list/delete",
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      console.log(res);
      setLoading(false);

      swal("Thành công!", "Đã xóa khỏi danh sách yêu thích!", "success");
    } catch (err) {
      console.log(err.response);
      setLoading(false);

      swal(
        "Thất bại!",
        "Có lỗi khi xóa sản phẩm khỏi yêu thích, vui lòng thử lại!",
        "error"
      );
    }
  }

  const { days: dayExpire, hours: hoursExpire, mins: minsExpire } = getTimeLeft(expireDate);


  console.log(dayExpire, hoursExpire, minsExpire)
  return (
    <div className="category__item">
      {days === 0 && hours === 0 && mins <= 30
        ?
        <div className='category__new'>
          NEW
        </div>
        : ""
      }
      <div
        className="category__item-img"
        style={{
          backgroundImage: `url(${src})`,
        }}
        onClick={() => history.push(`/detail/${prodId}`)}
      ></div>
      <p className="category__item-name">{name}</p>

      <div className="category__item-info">
        <p className="category__item-time">Đăng {Math.abs(days)} ngày trước</p>
        {!wish.isWish ? (
          <AiOutlineHeart onClick={handleAddToWishList} />
        ) : (
          <AiFillHeart onClick={handleRemoveToWishList} />
        )}
      </div>

      {buyNow === 0 ? (
        ""
      ) : (
        <p className="category__item-buy">
          Mua ngay: <span>{formatCurrency(buyNow)}</span>
        </p>
      )}

      <p className="category__item-expire">
        {
          dayExpire < 0 ? <p>Đã hết hạn</p> : (dayExpire > 0 ? `Còn: ${dayExpire} ngày` : (hoursExpire <= 0 ? `Còn: ${minsExpire} phút` : `Còn: ${hoursExpire} giờ`))
        }
      </p>

      <div className="category__item-button">
        <button
          onClick={() => history.push(`/detail/${prodId}`)}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default Category;
