import React, { useEffect, useState } from 'react';
import '../asset/css/Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCategory } from '../redux/actions/categoryAction';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { list_search } from '../redux/actions/productAction';

const selectAllCategory = (state) => state.allCategorys;

function Navbar() {
  const dispatch = useDispatch();
  const allCategory = useSelector(selectAllCategory).categorys;
  console.log('store la`', allCategory);
  const [data, setData] = useState({
    value: '',
  });

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  const fetchCategory = async () => {
    const response = await axios
      .get('https://onlineauctionserver.herokuapp.com/api/categories/list')
      .catch((err) => {
        console.log('Err', err);
      });
    dispatch(getCategory(response.data.listCategories));
    console.log('API ve', response.data.listCategories);
  };

  const searchProduct = async () => {
    const response = await axios
      .post('https://onlineauctionserver.herokuapp.com/api/product/search', {
        text: 'Nghệ thuật',
        orderMode: 0,
      })
      .catch((err) => {
        console.log('Err', err);
      });
    console.log('fdsfdsfds');
    dispatch(list_search(response.data.listProducts));
  };

  const history = useHistory();

  const KeyPress = (target) => {
    const value = data.value;
    if (target.charCode === 13) {
      history.push('/search', { update: value });
    }
  };

  const handleSubmit = () => {
    const value = data.value;
    history.push(`/search/${value}`);
  };
  // const Tim = () => {
  //     useEffect(() => {
  //         searchProduct();
  //     });
  //     history.push("/search");
  // }

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className='container'>
      <div className='logo'>
        <a href>
          <h3>Epic</h3>
          <p>Econon Service</p>
        </a>
      </div>
      <div className='menu-bar'>
        <ul>
          {allCategory.map((cat) => (
            <li className='active'>
              {' '}
              <Link to='/services' className='a'>
                {cat.cateName}
              </Link>
              <div className='sub-menu-1'>
                <ul>
                  {cat.subCategories.map((sub) => (
                    <li>
                      <Link to='/services' className='a'>
                        {sub.cateName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='form_div'>
        <form onSubmit={handleSubmit}>
          <div className='pseudo-search'>
            <input
              onChange={(e) => handle(e)}
              onKeyPress={KeyPress}
              id='value'
              type='text'
              placeholder='Search...'
              autofocus
              required
            />
            <button className='fa fa-search' type='submit'>
              tìm
            </button>
          </div>
        </form>
      </div>
      <div className='button-login'>
        <Link to="/sign-in" className='button-33'>Đăng Nhập</Link>
      </div>
    </div>
  );
}

export default Navbar;
