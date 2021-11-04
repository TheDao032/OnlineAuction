import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  AiFillDislike,
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiFillEdit,
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useRouteMatch } from 'react-router';
import swal from 'sweetalert';
import { setLoading } from '../../../redux/actions/loadingAction';
import formatCurrency from '../../../util/formatCurrency';
import formatTime from '../../../util/formatTime';
import Loading from '../../Loading/Loading';
import './scss/index.scss';
import { imagePlaceholder } from '../../../util/imagePlaceholder';
import getFullDay from '../../../util/getFullDay';
import { Route, Switch, useLocation } from 'react-router-dom';
import AddDescription from './AddDescription';

const dataUser = JSON.parse(localStorage.getItem('@user'));
let role = dataUser === null ? '' : dataUser?.user?.role;
let accId = dataUser === null ? '' : dataUser?.user?.accId;

export default function Detail() {
  const { prodId } = useParams();
  const dispatch = useDispatch();

  const loadingState = useSelector((state) => state.loading);

  const [product, setProduct] = useState([]);
  const [seller, setSeller] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [description, setDescription] = useState([]);
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    setUserRole(role);
  }, [userRole]);

  const fetchProductDetail = async () => {
    dispatch(setLoading(true));

    try {
      const response = await axios
        .post('https://onlineauctionserver.herokuapp.com/api/product/detail', {
          prodId: parseInt(prodId),
        })
        .catch((err) => {
          console.log('Err', err.response);
        });

      console.log(response.data.productDetail[0]);
      setProduct(response.data?.productDetail[0]);
      setSeller(response.data?.productDetail[0].seller);
      setDescription(response.data?.productDetail[0].prodDescription);
      setRelatedProduct(response.data?.productDetail[0].relatedProduct);
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));
    }
  };

  console.log('Product detail abc: ', product);
  const sellerID = seller[0]?.accId;

  const {
    prodName,
    createDate,
    expireDate,
    prodBeginPrice,
    prodBuyPrice,
    prodOfferNumber,
    prodStepPrice,
  } = product;

  const currenPrice = prodBeginPrice + prodOfferNumber * prodStepPrice;

  useEffect(() => {
    fetchProductDetail();
  }, [prodId]);

  const { days, hours, mins } = formatTime(expireDate);

  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(createDate);

  return (
    <>
      {loadingState.loading ? (
        <Loading />
      ) : (
        <div className='detail grid wide'>
          <div className='detail__container'>
            <div className='detail__image'>
              <div
                className='detail__image-item detail__image-item--big'
                style={{
                  backgroundImage: `url(${product.prodImages
                      ? product.prodImages[0]?.prodImgSrc
                      : imagePlaceholder
                    })`,
                }}
              ></div>
              <div className='detail__image-sub'>
                {!product.prodImages
                  ? ''
                  : product.prodImages.slice(0, 3).map((item) => (
                    <div
                      className='detail__image-item detail__image-item--small'
                      style={{
                        backgroundImage: `url(${item.prodImgSrc})`,
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className='detail__info'>
              <h3 className='detail__info-name'>{prodName}</h3>
              <div className='detail__info-header'>
                <p className='detail__info-releaseTime'>
                  Đăng bán vào:{'   '}
                  {daysSell > 0
                    ? `${daysSell} ngày trước`
                    : hours > 0
                      ? `${hoursSell} giờ trước`
                      : `${minSell} phút trước`}
                </p>
                <AddToWishList prodId={prodId} userRole={userRole} />
              </div>

              <div className='currentPrice'>
                <div className='currentPrice__left'>
                  <p className='currentPrice__text'>Giá hiện tại</p>
                  <p className='currentPrice__price'>
                    {formatCurrency(currenPrice)}
                  </p>
                </div>
                <div className='currentPrice__right'>
                  <p className='currentPrice__textEnd'>Thời gian kết thúc</p>
                  <DayLeft days={days} mins={mins} hours={hours} />
                </div>
              </div>
              {prodBuyPrice !== null && (
                <div className='buyNow'>
                  <p className='buyNow__text'>Mua ngay với giá chỉ</p>
                  <p className='buyNow__price'>
                    {formatCurrency(prodBuyPrice)}
                  </p>
                  {userRole !== '' ? (
                    <button className='buyNow__btn'>Mua ngay</button>
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div className='detail__seller'>
                <p className='detail__seller-name'>
                  Người bán:{' '}
                  {seller.map((s) => (
                    <span>
                      {' '}
                      {s.accName === '' ? 'Unknown Seller' : s.accName}
                    </span>
                  ))}
                </p>
                <p className='detail__seller-rate'>
                  <p className='detail__seller-react'>
                    {seller[0]?.accGoodVote}
                    <AiFillLike className='detail__seller-react--like' />
                  </p>
                  <p className='detail__seller-react'>
                    {seller[0]?.accBadVote}
                    <AiFillDislike className='detail__seller-react--dislike' />
                  </p>
                </p>
              </div>
              <div className='detail__bidder'>
                {product.biggestBidder === null ? (
                  <p className='detail__bidder-name'>
                    Sản phẩm chưa có người đặt cao nhất
                  </p>
                ) : (
                  <>
                    <p className='detail__bidder-name'>
                      Người đặt giá cao nhất:{' '}
                      <span>{product.biggestBidder}</span>
                    </p>
                    <p className='detail__bidder-rate'>
                      <p className='detail__bidder-react'>
                        12 <AiFillLike className='detail__bidder-react--like' />
                      </p>
                      <p className='detail__bidder-react'>
                        20{' '}
                        <AiFillDislike className='detail__bidder-react--dislike' />
                      </p>
                    </p>
                  </>
                )}
              </div>
              <Offer
                days={days}
                currentPrice={currenPrice}
                stepPrice={prodStepPrice}
                sellerID={sellerID}
                prodId={prodId}
              />
            </div>
          </div>
          <Description description={description} sellerID={sellerID} />
          <History />
          <div className='detail__relate'>
            <h5 className='detail__relate-title'>Sản phẩm tương tự</h5>
            <hr />

            {
              <>
                {relatedProduct
                  .slice(0, 5)
                  .filter((item) => item.prodId !== parseInt(prodId)).length ===
                  0 ? (
                  <p>Không có sản phẩm tương tự</p>
                ) : (
                  <div className='relate'>
                    {relatedProduct
                      .slice(0, 5)
                      .filter((item) => item.prodId !== parseInt(prodId))
                      .map((newItem) => {
                        const currentPrice =
                          prodBeginPrice + prodOfferNumber * prodStepPrice;
                        const ended =
                          formatTime(newItem.expireDate).days < 0
                            ? true
                            : false;

                        if (newItem.prodOfferNumber === null)
                          newItem.prodOfferNumber = 0;

                        return (
                          <RelateItem
                            src={newItem.prodImages[0]?.prodImgSrc}
                            seller={
                              newItem.seller[0]?.accName === ''
                                ? 'Unknown seller'
                                : newItem.seller?.accName
                            }
                            name={newItem.prodName}
                            price={currentPrice}
                            isEnd={ended}
                            prodId={newItem.prodId}
                          />
                        );
                      })}
                  </div>
                )}
              </>
            }
          </div>
        </div>
      )}
    </>
  );
}

function Offer({ currentPrice, stepPrice, sellerID, prodId, days }) {
  const defaultPrice = currentPrice + stepPrice;
  const [offer, setOffer] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  let { loggedIn } = useSelector((state) => state.currentUser);
  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  function handleOnChange(e) {
    const value = e.target.value;

    // console.log(value);
    setOffer(value);
  }

  useEffect(() => {
    setIsLogin(loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    setOffer(defaultPrice);
  }, [defaultPrice]);

  async function handleMakeBet(e) {
    e.preventDefault();

    if (role === 'SEL' && accId === sellerID) {
      return swal('Lỗi', 'Người bán không thể đấu giá!', 'error');
    }

    const data = {
      prodId: +prodId,
      aucPriceOffer: parseFloat(offer).toFixed(3),
    };

    console.log(data);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/bidder/offer',
        data,
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      console.log(res);
      dispatch(setLoading(false));
      swal(
        'Thành công',
        `Đấu giá thành công với số tiền ${formatCurrency(parseFloat(offer))}`,
        'success'
      );
    } catch (error) {
      console.log(error.response);
      dispatch(setLoading(false));

      if (error.response.data.errorMessage)
        swal('Unsuccessful', error.response.data.errorMessage, 'error');
    }
  }

  return (
    <form className='detail__offer'>
      <label for='offer'>Giá đề nghị:</label>
      <input
        type='number'
        id='offer'
        name='offer'
        className='detail__offer-input'
        value={offer}
        onChange={handleOnChange}
      />
      <hr />
      {days < 0 ? (
        <p className='detail__offer-btn' style={{ display: 'inline-block' }}>
          Thời gian đấu giá đã kết thúc
        </p>
      ) : isLogin ? (
        <button className='detail__offer-btn' onClick={handleMakeBet}>
          Ra giá
        </button>
      ) : (
        <p className='detail__offer-btn' style={{ display: 'inline-block' }}>
          Hãy đăng nhập để đấu giá sản phẩm này
        </p>
      )}
      { }
    </form>
  );
}

function Description({ description, sellerID }) {
  const currentUser = useSelector((state) => state.currentUser);
  const userRole = currentUser?.user?.user?.role;
  const loggedIn = currentUser?.loggedIn;
  const accId = currentUser?.user?.user?.accId;

  const [isEdit, setIsEdit] = useState(false);

  function onAddDescription() {
    setIsEdit(true);
  }

  function onCancel(value) {
    setIsEdit(value);
  }
  return (
    <>
      <div className='detail__description'>
        <div className='detail__description-header'>
          <h5 className='detail__description-title'>Mô tả sản phẩm</h5>
          {userRole === 'SEL' && accId === sellerID && loggedIn === true ? (
            <button
              className='detail__description-btn'
              onClick={onAddDescription}
            >
              Thêm mô tả
            </button>
          ) : (
            ''
          )}
        </div>
        <hr />
        {description.length === 0 ? (
          <p>Sản phẩm này chưa có mô tả</p>
        ) : (
          <>
            {isEdit ? <AddDescription onCancel={onCancel} /> : ''}

            {description?.map((item, index) => {
              return (
                <>
                  {index !== 0 ? (
                    <div className='detail__info-description-day'>
                      <AiFillEdit />
                      <p>{getFullDay(item.prod_desc_updated_date)}</p>
                    </div>
                  ) : (
                    ''
                  )}
                  <p
                    className='detail__info-description'
                    dangerouslySetInnerHTML={{ __html: item.prod_desc_content }}
                  ></p>
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

function RelateItem({ src, seller, price, name, isEnd, prodId }) {
  const history = useHistory();

  function onClickRelate() {
    history.push(`/detail/${prodId}`);
    window.scrollTo(0, 0);
  }

  return (
    <div className='relate__item' onClick={onClickRelate}>
      <div
        className='relate__item-img'
        style={{ backgroundImage: `url(${src})` }}
      />
      <p className='relate__item-name'>{name}</p>
      <p className='relate__item-seller'>
        <span>By</span>
        {seller}
      </p>
      <p className='relate__item-price'>{formatCurrency(price)}</p>
      {isEnd ? (
        <p className='relate__item-noti relate__item-noti--ended'>
          Đã kết thúc
        </p>
      ) : (
        <p className='relate__item-noti relate__item-noti--inprocess'>
          Đang diễn ra
        </p>
      )}
    </div>
  );
}

function TimeLeft({ days, hours, mins }) {
  return (
    <div className='currentPrice__timeleft-item'>
      <p className='currentPrice__daysleft'>{days} ngày</p>
      <p className='currentPrice__hoursleft'>{hours} giờ </p>
      <p className='currentPrice__minsleft'>{mins} phút</p>
    </div>
  );
}

function DayLeft({ days, hours, mins }) {
  return (
    <div className='currentPrice__timeEnd'>
      {days <= 3 && days > 0 ? (
        <p className='currentPrice__timeleft'>Còn {days} ngày nữa!</p>
      ) : days === 0 ? (
        hours !== 0 ? (
          <p className='currentPrice__timeleft'>Còn {hours} giờ nữa</p>
        ) : (
          <p className='currentPrice__timeleft'>Còn {mins} phút nữa</p>
        )
      ) : days < 0 ? (
        <p className='currentPrice__ended'>Đã kết thúc</p>
      ) : (
        <TimeLeft days={days} hours={hours} mins={mins} />
      )}
    </div>
  );
}

function AddToWishList({ prodId, userRole }) {
  prodId = parseInt(prodId);

  const dispatch = useDispatch();
  const history = useHistory();

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
          'https://onlineauctionserver.herokuapp.com/api/watch-list/list',
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
        console.log('Danh sách Watch list lỗi: ', error.response);
      }
    }
  }

  // console.log('sản phảm đã thích là: ', wishItem);

  // console.log('item check: ', isWish);
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
        dispatch(setLoading(true));

        const res = await axios.post(
          'https://onlineauctionserver.herokuapp.com/api/watch-list/add',
          {
            prodId,
          },
          { headers: { authorization: accessToken } }
        );

        console.log(res);
        setWish({
          isWish: true,
          watchId: res.data.watchId,
        });
        dispatch(setLoading(false));

        swal('Thành công!', 'Sản phẩm đã được thêm vào yêu thích!', 'success');
      } catch (err) {
        console.log(err.response);
        dispatch(setLoading(false));
        swal(
          'Thất bại!',
          'Có lỗi khi thêm sản phẩm vào yêu thích, vui lòng thử lại!',
          'error'
        );
      }
    } else {
      history.push('/sign-in');
    }
  }

  async function handleRemoveToWishList() {
    let { watchId } = wish;
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/watch-list/delete',
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      console.log(res);
      dispatch(setLoading(false));

      swal('Thành công!', 'Đã xóa khỏi danh sách yêu thích!', 'success');
    } catch (err) {
      console.log(err.response);
      dispatch(setLoading(false));

      swal(
        'Thất bại!',
        'Có lỗi khi xóa sản phẩm khỏi yêu thích, vui lòng thử lại!',
        'error'
      );
    }
  }

  return (
    <>
      {!wish.isWish ? (
        <div className='detail__wishList'>
          <button
            className='detail__wishList-btn'
            onClick={handleAddToWishList}
          >
            <AiOutlineHeart />
            <p className='detail__wishList-text'>Thêm vào yêu thích</p>
          </button>
        </div>
      ) : (
        <div className='detail__wishList detail__wishList--remove'>
          <button
            className='detail__wishList-btn'
            onClick={handleRemoveToWishList}
          >
            <AiFillHeart style={{ color: 'red' }} />
            <p className='detail__wishList-text'>Xóa khỏi yêu thích</p>
          </button>
        </div>
      )}
    </>
  );
}

function History() {
  return (
    <div className='detail__history'>
      <h5 className='detail__history-title'>Lịch sử đấu giá</h5>
      <hr />
      <div className='detail__history-header'>
        <table className='detail__history-table'>
          <thead className='detail__history-thead'>
            <tr className='detail__history-tr'>
              <th>Thời điểm</th>
              <th>Người mua</th>
              <th>Giá</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className='detail__history-content'>
        <table className='detail__history-table'>
          <tbody className='detail__history-tbody'>
            <BidderHistory
              time='1/11/2019 10:43'
              name='Hồ Thảo Diệu'
              price={20001915}
            />
            <BidderHistory
              time='1/11/2019 10:43'
              name='Nguyễn Đăng Khoa Điền'
              price={20001923}
            />
            <BidderHistory
              time='1/11/2019 10:43'
              name='Phan Vũ Thanh Đạo'
              price={20001915}
            />
            <BidderHistory time='1/11/2019 10:43' name='Ân' price={20001915} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BidderHistory({ time, name, price }) {
  const converName = (name) => {
    const stringArr = name.split(' ');
    const n = stringArr.length;
    let newName = '';
    for (let i = 0; i < n - 1; i++) {
      for (let s of stringArr[i]) {
        s = '*';
        newName += s;
      }
      newName += ' ';
    }
    newName += stringArr[n - 1];

    return newName;
  };

  return (
    <tr className='detail__history-tr'>
      <td>{time}</td>
      <td>{converName(name)}</td>
      <td>{formatCurrency(price)}</td>
    </tr>
  );
}
