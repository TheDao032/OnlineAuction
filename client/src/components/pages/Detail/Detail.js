import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import './Detail.scss';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import formatCurrency from '../../../util/formatCurrency';
import formatTime from '../../../util/formatTime';

export default function Detail() {
  const { prodId } = useParams();
  // const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProductDetail = async () => {
    setLoading(true);
    const response = await axios
      .post('https://onlineauctionserver.herokuapp.com/api/product/detail', {
        prodId: parseInt(prodId),
      })
      .catch((err) => {
        console.log('Err', err);
      });

    console.log('product fetch', response.data.productDetail);
    setProduct(response.data.productDetail[0]);
    setLoading(false);
  };

  console.log('Product detail: ', product);
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

  const { days, hours, mins } = formatTime('2021-10-30 22:23:12');

  const {
    days: daysSell,
    hours: hoursSell,
    mins: minSell,
  } = formatTime(createDate);

  const description = `<p style="text-align:start;"><span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: 17px;font-family: Times New Roman", Georgia, serif;">Vào hồi tháng 7/2021, trên MXH bất ngờ xuất hiện một nhân vật tên</span> <a href="https://kenh14.vn/minh-thu.html" target="_blank"><span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: inherit;font-family: inherit;">Minh Thu</span></a> <span style="color: rgb(34,34,34);background-color: rgb(255,255,255);font-size: 17px;font-family: Times New Roman", Georgia, serif;">(sinh năm 1997). Đây là cái tên đã gây nên sóng gió trên internet vào thời điểm ấy khi mỗi livestream chia sẻ về Vật Lý của Minh Thu có lượng tương tác cực khủng trên MXH. Chỉ sau một 1 đêm, livestream của Minh Thu đã đạt ngưỡng hơn 400 nghìn lượt xem và hàng chục nghìn lượt follow ở fanpage của mình.</span></p>
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
          <p className='detail__info-releaseTime'>
            Đăng bán vào:{'   '}
            {daysSell > 0
              ? `${daysSell} ngày trước`
              : hours > 0
              ? `${hoursSell} giờ trước`
              : `${minSell} phút trước`}
          </p>
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
              <button className='buyNow__btn'>Mua ngay</button>
            </div>
          )}
          <div className='detail__seller'>
            <p className='detail__seller-name'>
              Người bán: <span>Nguyễn Thế Đạo</span>
            </p>
            <p className='detail__seller-rate'>
              <p className='detail__seller-react'>
                2 <AiFillLike className='detail__seller-react--like' />
              </p>
              <p className='detail__seller-react'>
                100 <AiFillDislike className='detail__seller-react--dislike' />
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
        </div>
      </div>
      <button className='addDescription'>Thêm mô tả</button>
      <p
        className='detail__info-description'
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
      <div className='detail__relate'>
        <h5 className='detail__relate-title'>Sản phẩm tương tự</h5>
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
