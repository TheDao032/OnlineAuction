import React from 'react';
import { Link } from 'react-router-dom';
import './Info.css';


function Info() {


    return (
        <div className="header">
            <div className="main">
                <div className="text">
                    <h1><span className="sp">Online Auction </span>Service</h1>
                    <p>Expore the world with us</p>
                    <div className="active">
                        <Link to='/signup' className="btnone">Learn more</Link>
                        <Link className="btntwo">Signup Here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Info;