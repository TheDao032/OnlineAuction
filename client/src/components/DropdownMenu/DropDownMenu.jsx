import React from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logOut } from "../../redux/actions/userAction";
import "./DropDownMenu.scss";

DropDownMenu.propTypes = {};

const Profile = {
  Bidder() {
    const history = useHistory();
    function directBidderProfile() {
      history.push("/bidder/profile/my-profile");
    }

    return (
      <>
        <span className="menu-signin__menu-item" onClick={directBidderProfile}>
          Hồ sơ của bạn
        </span>
      </>
    );
  },
  Seller() {
    const history = useHistory();

    function directSellerProfile() {
      history.push("/seller");
    }
    return (
      <>
        <span className="menu-signin__menu-item" onClick={directSellerProfile}>
          Hồ sơ của bạn
        </span>
      </>
    );
  },
  Admin() {
    const history = useHistory();

    function directAdminProfile() {
      history.push("/admin/category");
    }
    return (
      <>
        <span className="menu-signin__menu-item" onClick={directAdminProfile}>
          Hồ sơ của bạn
        </span>
      </>
    );
  },
};

function DropDownMenu() {
  const dispatch = useDispatch();
  const history = useHistory();
  const dataUser = JSON.parse(localStorage.getItem("@user"));
  let role = dataUser === null ? "" : dataUser?.user?.role;

  function handleLogout() {
    dispatch(logOut());
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="menu-signin">
      <div className="menu-signin__btn">
        <FaUser />
        <p style={{ textAlign: "center" }}>
          {dataUser?.user.accName !== null ? dataUser?.user.accName : "Unknown"}
        </p>
      </div>
      <div className="menu-signin__menu">
        {role === "BID" ? (
          <Profile.Bidder />
        ) : role === "SEL" ? (
          <Profile.Seller />
        ) : role === "ADM" ? (
          <Profile.Admin />
        ) : (
          ""
        )}
        <span className="menu-signin__menu-item" onClick={handleLogout}>
          Đăng xuất
        </span>
      </div>
    </div>
  );
}

export default DropDownMenu;
