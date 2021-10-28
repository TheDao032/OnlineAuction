import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import './Detail.scss';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import formatCurrency from '../../../util/formatCurrency';
import formatTime from '../../../util/formatTime';
import { AiOutlineHeart } from 'react-icons/ai';

const dataUser = JSON.parse(localStorage.getItem('@user'));
let role = dataUser === null ? '' : dataUser?.role;
let accId = dataUser === null ? '' : dataUser?.accId;

export default function Detail() {
  const { prodId } = useParams();
  // const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [seller, setSeller] = useState([]);

  const fetchProductDetail = async () => {
    setLoading(true);
    const response = await axios
      .post('https://onlineauctionserver.herokuapp.com/api/product/detail', {
        prodId: parseInt(prodId),
      })
      .catch((err) => {
        console.log('Err', err);
      });
    setProduct(response.data.productDetail[0]);
    setSeller(response.data.productDetail[0].seller);
    console.log(
      'the dao cho: ',
      response.data.productDetail[0].seller[0].accName
    );

    setLoading(false);
  };

  console.log('Product detail abc: ', product);
  console.log('cái mảng nè dume nứng lắm: ', seller);
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
            <AddToWishList />
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
              <p className='buyNow__price'>{formatCurrency(prodBuyPrice)}</p>
              {role !== '' ? (
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
                20 <AiFillDislike className='detail__bidder-react--dislike' />
              </p>
            </p>
          </div>
          <Offer currentPrice={currenPrice} stepPrice={prodStepPrice} />
        </div>
      </div>
      <Description description={description} sellerID={sellerID} />
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

function AddToWishList() {
  return (
    <>
      {role === 'BID' ? (
        <div className='detail__wishList'>
          <button className='detail__wishList-btn'>
            <AiOutlineHeart />
            <p className='detail__wishList-text'>Thêm vào yêu thích</p>
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

function Offer({ currentPrice, stepPrice }) {
  return (
    <form className='detail__offer'>
      <label for='offer'>Giá đề nghị:</label>
      <input
        id='offer'
        name='offer'
        className='detail__offer-input'
        value={formatCurrency(currentPrice + stepPrice)}
        disabled
      />
      <hr />
      {role === '' ? (
        <p className='detail__offer-btn' style={{ display: 'inline-block' }}>
          Hãy đăng nhập để đấu giá sản phẩm này
        </p>
      ) : (
        <button className='detail__offer-btn'>Ra giá</button>
      )}
    </form>
  );
}

function Description({ description, sellerID }) {
  return (
    <div className='detail__description'>
      <div className='detail__description-header'>
        <h5 className='detail__description-title'>Mô tả sản phẩm</h5>
        {role === 'SEL' && accId === sellerID ? (
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
