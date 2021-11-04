import React, { useState } from "react";
import EditorField from "../../../feature/Seller/components/CreatePost/Editor";
import axios from "axios";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/actions/loadingAction";
import { useParams } from "react-router";

function AddDescription({ onCancel }) {
  const [prodDescription, setProdDescription] = useState("");
  const dispatch = useDispatch();
  let { prodId } = useParams();

  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  prodId = parseInt(prodId);

  function handleCancel() {
    if (onCancel) {
      onCancel(false);
    }
  }

  function getDetailEditor(description) {
    setProdDescription(description);
  }

  async function handleSubmit() {
    const data = {
      prodId,
      prodDescription,
    };

    if (prodDescription === "") {
      swal("Thất bại!", "Vui lòng nhập mô tả", "error");
    } else {
      try {
        dispatch(setLoading(true));
        const res = await axios.post(
          "https://onlineauctionserver.herokuapp.com/api/seller/update-description",
          data,
          {
            headers: {
              authorization: accessToken,
            },
          }
        );

        dispatch(setLoading(false));
        console.log(res);
        swal("Thành công!", "Thêm mô tả thành công!", "success").then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.log(error.response);
        dispatch(setLoading(false));
        swal("Thất bại!", "Có lỗi khi thêm mô tả, vui lòng thử lại", "error");
      }
    }
  }

  return (
    <div className="detail__description-add">
      <p>Thêm mô tả</p>
      <EditorField onEditorStateChange={getDetailEditor} />
      <div className="detail__description-action">
        <button
          className="detail__description-action--submit"
          onClick={handleSubmit}
        >
          Thêm mô tả
        </button>
        <button
          className="detail__description-action--cancel"
          onClick={handleCancel}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

export default AddDescription;
