import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setLoading } from "../../../../redux/actions/loadingAction";
import "./ListPermission.scss";
ListPermission.propTypes = {};

function ListPermission(props) {
  const dispatch = useDispatch();
  const { prodId } = useParams();

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  async function getListPermission() {
    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        " https://onlineauctionserver.herokuapp.com/api/seller/list-permission",
        {
          prodId: +prodId,
        },
        {
          headers: {
            authorization: accessToken,
          },
        }
      );

      console.log(res.data);

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.response);
    }
  }

  useEffect(() => {
    getListPermission();
  }, []);

  return (
    <>
      <div className="listPermission">
        <h1 className="listPermission__title">Danh sách đang đấu giá</h1>
      </div>
    </>
  );
}

export default ListPermission;
