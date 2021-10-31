import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import './Detail.scss';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import formatCurrency from '../../../util/formatCurrency';
import formatTime from '../../../util/formatTime';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../redux/actions/loadingAction';
import Loading from '../../Loading/Loading';

const dataUser = JSON.parse(localStorage.getItem('@user'));
let role = dataUser === null ? '' : dataUser?.user?.role;
let accId = dataUser === null ? '' : dataUser?.user?.accId;
const accessToken = dataUser === null ? null : dataUser?.accessToken;

export default function Detail() {
  const { prodId } = useParams();
  const dispatch = useDispatch();

  const loadingState = useSelector((state) => state.loading);

  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState([]);
  const [userRole, setUserRole] = useState('');

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
      setProduct(response.data.productDetail[0]);
      setSeller(response.data.productDetail[0].seller);
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
  }, []);

  const { days, hours, mins } = formatTime(expireDate);

  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(createDate);

  const description = `<p style="text-align:left;"><span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: 17px;font-family: Tahoma;">Số là khi chiếc Bentley đắt đỏ vừa về Việt Nam, rich kid có lên sóng một video cận cảnh chiếc xe. Bên dưới comment, Lệ Quyên cũng góp vui:</span><span style="font-family: Tahoma;"> </span><span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: inherit;font-family: Tahoma;"><em>"Lúc nào cho mẹ đi ké Bo nha"</em></span><span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: 17px;font-family: Tahoma;">. Dù không lên tiếng trả lời lại, song story của Lệ Quyên cho thấy Anthony đã thực hiện điều mẹ mong muốn rồi đây.</span></p>
<p style="text-align:left;"></p>
<p style="text-align:left;"></p>
<div style="text-align:none;"><img src="https://kenh14cdn.com/thumb_w/620/203336854389633024/2021/10/22/photo-1-1634907369720988878706.jpg" alt="Quý tử Lệ Quyên đem siêu xe 30 tỷ được bố tặng thực hiện điều đặc biệt mẹ mong mỏi bấy lâu - Ảnh 3." style="height: ;width: 580px"/></div>
<p style="text-align:left;"></p>
<p style="text-align:left;"><span style="color: rgb(102,102,102);background-color: rgb(242,242,242);font-size: 17px;font-family: Tahoma;"><em>Chiếc "xế hộp" hạng sang có giá khoảng 30 tỷ đại gia Đức Huy tặng riêng cho con trai</em></span><span style="font-family: Tahoma;"> </span></p>
`;

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
                  backgroundImage: `url('https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=')`,
                }}
              ></div>
              <div className='detail__image-sub'>
                <div
                  className='detail__image-item detail__image-item--small'
                  style={{
                    backgroundImage: `url('https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=')`,
                  }}
                ></div>
                <div
                  className='detail__image-item detail__image-item--small'
                  style={{
                    backgroundImage: `url('https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=')`,
                  }}
                ></div>
                <div
                  className='detail__image-item detail__image-item--small'
                  style={{
                    backgroundImage: `url('https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=')`,
                  }}
                ></div>
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
              {prodBuyPrice !== 0 && (
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
                    <span> {s.accName}</span>
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
                <p className='detail__bidder-name'>
                  Người đặt giá cao nhất: <span>Phạm Thị Ngọc Hạnh</span>
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
          <Description
            description={description}
            sellerID={sellerID}
            userRole={userRole}
          />
          <History />
          <div className='detail__relate'>
            <h5 className='detail__relate-title'>Sản phẩm tương tự</h5>
            <hr />
            <div className='relate'>
              <RelateItem src='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=' />
              <RelateItem src='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=' />
              <RelateItem src='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=' />
              <RelateItem src='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=' />
              <RelateItem src='https://media.istockphoto.com/photos/apple-watch-sport-42mm-silver-aluminum-case-with-black-band-picture-id498433288?k=20&m=498433288&s=612x612&w=0&h=5pHvphNX0hies1n4lwfJmZNWuEb9HWSAzPqrdwHKkRI=' />
            </div>
          </div>
        </div>
      )}
    </>
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

function RelateItem({ src, seller, price, name }) {
  return (
    <div className='relate__item'>
      <div
        className='relate__item-img'
        style={{ backgroundImage: `url(${src})` }}
      />
      <p className='relate__item-name'>
        Nồi Chiên Không Dầu Điện Tử Lock&Lock EJF357BLK (5.2 Lít) - Hàng Chính
        Hãng
      </p>
      <p className='relate__item-seller'>
        <span>By</span>Nguyễn Thế Đạo
      </p>
      <p className='relate__item-price'>{formatCurrency(120000000)}</p>
      <p className='relate__item-noti'>Đang diễn ra</p>
    </div>
  );
}

function AddToWishList({ prodId, userRole }) {
  prodId = parseInt(prodId);

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
    try {
      const res = await axios.get(
        'https://onlineauctionserver.herokuapp.com/api/watch-list/list',
        {
          headers: {
            authorization: accessToken,
          },
        }
      );
      setWishItem(res.data.listWatch);
    } catch (error) {
      console.log('Danh sách Watch list lỗi: ', error.response);
    }
  }

  console.log('sản phảm đã thích là: ', wishItem);

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
        swal('Thành công!', 'Sản phẩm đã được thêm vào yêu thích!', 'success');
      } catch (err) {
        console.log(err.response);
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
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/watch-list/delete',
        {
          watchId,
        },
        { headers: { authorization: accessToken } }
      );

      console.log(res);
      swal('Thành công!', 'Đã xóa khỏi danh sách yêu thích!', 'success');
    } catch (err) {
      console.log(err.response);
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

function Offer({ currentPrice, stepPrice, sellerID, prodId, days }) {
  const defaultPrice = currentPrice + stepPrice;
  const [offer, setOffer] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  let { loggedIn } = useSelector((state) => state.currentUser);

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
      prodId,
      aucPriceOffer: parseFloat(offer).toFixed(3),
    };

    try {
      const res = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/bidder/offer',
        data,
        {
          header: {
            authorization: accessToken,
          },
        }
      );

      console.log(res);
    } catch (error) {
      console.log(error.response);
    }
    // swal(
    //   'Thành công',
    //   `Đấu giá thành công với số tiền ${formatCurrency(parseFloat(offer))}`,
    //   'success'
    // );
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
      {}
    </form>
  );
}

function Description({ description, sellerID, userRole }) {
  return (
    <div className='detail__description'>
      <div className='detail__description-header'>
        <h5 className='detail__description-title'>Mô tả sản phẩm</h5>
        {userRole === 'SEL' && accId === sellerID ? (
          <button className='detail__description-btn'>Thêm mô tả</button>
        ) : (
          ''
        )}
      </div>
      <hr />
      <p
        className='detail__info-description'
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </div>
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
