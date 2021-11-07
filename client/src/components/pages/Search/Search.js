import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Empty from "../../Empty/Empty";
import Loading from "../../Loading/Loading";
import { imagePlaceholder } from "../../../util/imagePlaceholder";
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiFillEdit,
} from "react-icons/ai";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import formatTime from "../../../util/formatTime";
import "./Search.scss";

export default function Search() {
  const { text } = useParams();
  console.log("nguoi dung nhap la:", text);
  const [dataSearch, setData] = useState([]);
  const [dataPagination, setDataPagination] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(3);
  const [itemLimit, setImtemLimit] = useState(2);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);



  const fetchProductSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://onlineauctionserver.herokuapp.com/api/product/search",
        {
          text: text,
          orderMode: 0,
        }
      );
      setLoading(false);
      console.log("dl lieu sau khi search", response.data.listProducts);
      setData(response.data.listProducts);

      console.log("dl lieu sau khi phan trang", dataPagination);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductSearch();
  }, []);

  useEffect(() => {
    console.log('dataSearch', dataSearch)
    console.log((pageCurrent - 1) * itemLimit)
    console.log(pageCurrent * itemLimit)
    console.log(dataSearch.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit))
    setDataPagination(dataSearch.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit));
    setMaxPage(Math.ceil(dataSearch.length / itemLimit));
  }, [dataSearch])

  useEffect(() => {
    setDataPagination(dataSearch.slice((pageCurrent - 1) * itemLimit, pageCurrent * itemLimit));
  }, [pageCurrent])

  var dataPage = "";
  const handleChange = (e) => {
    dataPage = e.target.value;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (parseInt(dataPage) < 1 || parseInt(dataPage) > maxPage){
        alert("Số trang không phù hợp")
      }
      else{
        setPageCurrent(dataPage);
      }
    }
  };



  if (loading) return <Loading />;
  console.log(dataSearch);
  return (
    <div>
      <div className="search grid wide">
        {dataSearch.length === 0 ? (
          <Empty title="Không tìm thấy sản phẩm" />
        ) : (
          <div className="search__container">
            {dataPagination.map((item) => {
              return (
                <SearchItem
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
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="pagination">
        <button className="pagination-button" disabled={pageCurrent === 1} onClick={() => setPageCurrent(pageCurrent - 1)}>Prev</button>
        <br />
        <input onChange={handleChange} onKeyPress={handleKeyPress} type="number" className="pagination-input" placeholder={pageCurrent} />
        <span className="pagination-span" >/</span>
        <p className="pagination-p">{maxPage}</p>
        <button className="pagination-button" disabled={pageCurrent === maxPage} onClick={() => setPageCurrent(pageCurrent + 1)}>Next</button>
      </div>
    </div>

  );
}

function SearchItem({ src, name, createDate, prodId, loading, setLoading }) {
  const history = useHistory();
  const { days } = formatTime(createDate);

  prodId = parseInt(prodId);
  const dispatch = useDispatch();

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

  return (
    <div className="search__item">
      <div
        className="search__item-img"
        style={{
          backgroundImage: `url(${src})`,
        }}
        onClick={() => history.push(`/detail/${prodId}`)}
      ></div>
      <p className="search__item-name">{name}</p>
      <div className="search__item-info">
        <p className="search__item-time">Đăng {Math.abs(days)} ngày trước</p>
        {!wish.isWish ? (
          <AiOutlineHeart onClick={handleAddToWishList} />
        ) : (
          <AiFillHeart onClick={handleRemoveToWishList} />
        )}
      </div>
      <button
        className="search__item-button"
        onClick={() => history.push(`/detail/${prodId}`)}
      >
        Xem chi tiết
      </button>
    </div>
  );
}
