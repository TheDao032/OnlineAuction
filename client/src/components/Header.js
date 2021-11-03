import React from 'react';
import '../asset/css/Navbar.css';

export default function Header() {
    return (
        <div className="page-new">
            <div className="container-new">
                <div className="header">
                    <div className="header-logo">
                        <img
                            className="logo"
                            src="../../logo-white.png"
                            alt=""
                            height="45px"
                        />
                    </div>
                    <div className="header-list-item">
                        <div className="img-container">
                            <img className="item-last" alt="" />
                        </div>
                        <div className="img-container">
                            <img className="item-last" alt="" />
                        </div>
                        <div className="img-container">
                            <img className="item-last" alt="" />
                        </div>
                        <div className="img-container-last">
                            <img className="item-last" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
