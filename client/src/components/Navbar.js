import React, { useEffect, useState } from 'react';
import '../asset/css/Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCategory } from '../redux/actions/categoryAction';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { list_search } from '../redux/actions/productAction';
// import DropDownMenu from './DropdownMenu/DropDownMenu';
import { setLoading } from '../redux/actions/loadingAction';
import Loading from './Loading/Loading';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const selectAllCategory = (state) => state.allCategorys;
const currentUser = (state) => state.currentUser;

function Navbar1() {
  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.loading);

  const allCategory = useSelector(selectAllCategory).categorys;
  console.log('store la`', allCategory);
  const [data, setData] = useState({
    value: '',
  });

  const userInfo = useSelector(currentUser);

  function handle(e) {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
  }

  const fetchCategory = async () => {
    dispatch(setLoading(true));

    try {
      const response = await axios
        .get('https://onlineauctionserver.herokuapp.com/api/categories/list')
        .catch((err) => {
          console.log('Err', err);
        });
      dispatch(getCategory(response.data.listCategories));

      console.log('API ve', response.data.listCategories);
    } catch (error) {
      console.log(error.response);
    }

    dispatch(setLoading(false));
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
    <div className="menu-new">
      <div className="menu-main-new">
        <Navbar expand="lg" className="menu-main-wrap-new">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto">
              {allCategory.map((cat) => (
                <NavDropdown className="item-new" title={cat.cateName} id="basic-nav-dropdown">
                  {cat.subCategories.map((sub) => (
                    <NavDropdown.Item href="#action/3.1"> {sub.cateName}</NavDropdown.Item>
                  ))}
                  
                </NavDropdown>
              ))}
             
              {/* <Nav.Item className="item-new">
                <Link
                  to="/job-position"
                >
                  Vị Trí Ứng Tuyển
                </Link>
              </Nav.Item>
              <Nav.Item className="item-new">
                <Link
                  to="https://intern-career.unicloud.com.vn"
                  target="_blank"
                >
                  Dành cho sinh viên
                </Link>
              </Nav.Item>
              <Nav.Item className="item-new">
                <Link to="/news" >
                  Tin Tức
                </Link>
              </Nav.Item>
              <Nav.Item className="item-new-last">
                <Link
                  to="/about"
                >
                  Liên Hệ
                </Link>
              </Nav.Item> */}
            </Nav>

            <div className="btn-container">
              <button className="btn-ut">Ứng Tuyển Ngay</button>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
      
  );
}

export default Navbar1;
