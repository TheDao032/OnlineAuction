import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../asset/css/Info.css';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { get_top_5_almost_over } from '../redux/actions/productAction';
import { get_top_5_biggest_offer } from '../redux/actions/productAction';
import { get_top_5_biggest_price } from '../redux/actions/productAction';
const selectTop5AlmostOver = (state) => state.top5Almost;

export default function Info() {
  const dispatch = useDispatch();

  const top5Almost = useSelector(selectTop5AlmostOver).products;
  const top5Offer = useSelector(selectTop5AlmostOver).products_offer;
  const top5Price = useSelector(selectTop5AlmostOver).products_price;

  const fetchProduct1 = async () => {
    const response1 = await axios
      .get(
        'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-offer'
      )
      .catch((err) => {
        console.log('Err', err);
      });
    dispatch(get_top_5_biggest_offer(response1.data.listBiggestOffer));
    console.log('API ve offer', response1.data.listBiggestOffer);
  };

  const fetchProduct2 = async () => {
    const response2 = await axios
      .get(
        'https://onlineauctionserver.herokuapp.com/api/product/list-biggest-price'
      )
      .catch((err) => {
        console.log('Err', err);
      });
    dispatch(get_top_5_biggest_price(response2.data.listBiggestPrice));
    console.log('API ve offer', response2.data.listBiggestPrice);
  };

  useEffect(() => {
    // fetchProduct();
    fetchProduct1();
    fetchProduct2();
  }, []);

  var sum = 0;

  return (
    <div className='page-an'>
      <div className='banner'>
        <div className='banner-contain'>
          <h1 className='h1-banner'>Dẫn đầu kĩ nguyên đấu giá thông minh</h1>
          <div className='btn-container-tht'>
            <Link to='/signup' className='btn-tht'>
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>

      <div className='page'>
        <div className='page-info'>
          <div className='contain-info'>
            <h2 className='h2-top'>Top 5 sản phẩm bán chạy nhất</h2>

            <div className='slider-container'>
              <Swiper
                watchSlidesProgress={true}
                slidesPerView={3}
                className='mySwiper'
              >
                <SwiperSlide className='sl'>
                  <h1>01</h1>
                  <h5>Job Title</h5>
                  <p>
                    Leverage agile frameworks to provide a robust <br />
                    synopsis for high level overviews. Iterative <br />
                    approaches to corporate strategy foster
                    <br />
                    collaborative thinking to further the overall <br />
                    value proposition.Organically grow the <br />
                    holistic world view of disruptive innovation..
                  </p>
                  <h6>Xem Chi Tiết</h6>
                </SwiperSlide>

                <SwiperSlide className='sl'>
                  <h1>02</h1>
                  <h5>Job Title</h5>
                  <p>
                    Bring to the table win-win survival strategies
                    <br />
                    to ensure proactive domination. At the end of <br />
                    the day, going forward, a new normal that has
                    <br />
                    evolved from generation X is on the runway <br />
                    heading towards a streamlined cloud solution. .
                  </p>
                  <h6>Xem Chi Tiết</h6>
                </SwiperSlide>
                <SwiperSlide className='sl'>
                  <h1>03</h1>
                  <h5>Job Title</h5>
                  <p>
                    Capitalize on low hanging fruit to identify a <br />
                    ballpark value added activity to beta test.
                    <br />
                    Override the digital divide with additional
                    <br />
                    click through from DevOps. Nanotechnology
                    <br />
                    immersion along the information highway will close the loop.
                  </p>
                  <h6>Xem Chi Tiết</h6>
                </SwiperSlide>
                <SwiperSlide className='sl'>
                  <h1>04</h1>
                  <h5>Job Title</h5>
                  <p>
                    Capitalize on low hanging fruit to identify a <br />
                    ballpark value added activity to beta test.
                    <br />
                    Override the digital divide with additional
                    <br />
                    click through from DevOps. Nanotechnology
                    <br />
                    immersion along the information highway will close the loop.
                  </p>
                  <h6>Xem Chi Tiết</h6>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          <div className='page-info-1'>
            <div className='contain-info-1'>
              <h2 className='h2-top'>
                Top 5 sản phẩm giá được offer nhiều nhất
              </h2>

              <div className='slider-container'>
                <Swiper
                  watchSlidesProgress={true}
                  slidesPerView={3}
                  className='mySwiper'
                >
                  {top5Offer.map((product) => (
                    <SwiperSlide className='sl'>
                      <h1>0{(sum = sum + 1)}</h1>
                      <h5>{product.prodName}</h5>
                      <p>
                        Leverage agile frameworks to provide a robust <br />
                        synopsis for high level overviews. Iterative <br />
                        approaches to corporate strategy foster
                        <br />
                        collaborative thinking to further the overall <br />
                        value proposition.Organically grow the <br />
                        holistic world view of disruptive innovation..
                      </p>
                      <Link to={`/detail/${product.prodId}`}>
                        <h6>Xem Chi Tiết</h6>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className='contain-info'>
            <h2 className='h2-top'>Top 5 sản phẩm có giá cao nhất</h2>

            <div className='slider-container'>
              <Swiper
                watchSlidesProgress={true}
                slidesPerView={3}
                className='mySwiper'
              >
                {top5Price.map((product) => (
                  <SwiperSlide className='sl'>
                    <h1>0{(sum = sum + 1)}</h1>
                    <h5>{product.prodName}</h5>
                    <p>
                      Leverage agile frameworks to provide a robust <br />
                      synopsis for high level overviews. Iterative <br />
                      approaches to corporate strategy foster
                      <br />
                      collaborative thinking to further the overall <br />
                      value proposition.Organically grow the <br />
                      holistic world view of disruptive innovation..
                    </p>
                    <Link to={`/detail/${product.prodId}`}>
                      <h6>Xem Chi Tiết</h6>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* <div className="page-highlight">
                <div className="contain-highlight">

                </div>
            </div> */}
      </div>
    </div>
  );
}
