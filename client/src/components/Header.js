import React from 'react';
import '../asset/css/Navbar.css';
import { useHistory } from "react-router-dom";

export default function Header() {
  const history = useHistory();

  var dataSearch = "";
  const handleChange = (e) => {
    dataSearch = e.target.value;
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      history.push(`/search/${dataSearch}`);
    }
  }

  return (
    <div className='page-new'>
      <div className='container-new'>
        <div className='header'>
          <div className='header-logo'>
            <img
              className='logo'
              src='logo-new.svg'
              alt=''
              height='45px'
            />
          </div>
          <div className='header-list-item'>
            <form class="search-container">
              <input type="text" id="search-bar" onKeyPress={handleKeyPress} onChange={handleChange} placeholder="Search" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
