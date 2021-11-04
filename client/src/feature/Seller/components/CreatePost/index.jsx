import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import InputField from "../../../../components/formComtrol/inputField";
import NumberField from "../../../../components/formComtrol/numberField";
import SelectField from "../../../../components/formComtrol/selectField";
import { setLoading } from "../../../../redux/actions/loadingAction";
import SelectChildCateFiled from "../selectChild";
import AutoRenew from "./AutoRenew";
import BuyNowField from "./BuyNowField";
import EditorField from "./Editor";
import ImageUpload from "./ImageUpload";

CreatePost.propTypes = {};

function CreatePost(props) {
  const {
    user: { accessToken },
  } = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();

  const [father, setFather] = useState(null);
  const [value, setValue] = useState({
    prodName: "",
    prodBeginPrice: 0,
    prodStepPrice: 0,
    prodBuyPrice: 0,
    prodIsAutoRenew: false,
    prodDescription: "",
    image: [],
    prodExpired: 1,
  });

  const { image } = value;

  const schema = yup.object().shape({
    prodName: yup
      .string()
      .required("Nhập tên sản phẩm")
      .min(5, "Tối thiếu 5 chữ"),
    prodStepPrice: yup
      .number()
      .required("Nhập bước giá")
      .positive("Bước giá phải lớn hơn không"),
    prodCateId: yup.number().required("Chọn loại hàng"),
    prodBeginPrice: yup.number().min(1, "Giá khởi điểm phải lớn hơn không"),
    prodExpired: yup.number().min(1, "Tối thiểu 1 ngày"),
    prodFatherCateId: yup.number().required("Chọn loại hàng"),
  });

  const form = useForm({
    defaultValues: {
      prodName: "",
      prodBeginPrice: "0",
      prodStepPrice: "0",
      prodBuyPrice: "0",
      prodExpired: 1,
    },

    resolver: yupResolver(schema),
  });

  function uploadSingleFile(imgUpload) {
    setValue({
      ...value,
      image: [
        ...image,
        {
          id: uuidv4(),
          src: imgUpload,
        },
      ],
    });
  }

  const handleDeleteImg = (listImg) => {
    setValue({ ...value, image: listImg });
  };

  const handleOnChange = (valueOnChange) => {
    setValue({ ...value, prodIsAutoRenew: valueOnChange });
  };

  function getDetailEditor(prodDescription) {
    setValue({ ...value, prodDescription });
  }

  const getCategoryFather = (id) => {
    setFather(id);
  };

  const handleOnSubmit = async (data) => {
    // console.log(image)
    if (value.image.length >= 3) {
      const image = value.image.map((item) => {
        return { src: item.src };
      });

      if (data.prodBuyPrice === "0" || data.prodBuyPrice === null) {
        data = {
          prodImage: image,
          prodDescription: value.prodDescription,
          prodIsAutoRenew: value.prodIsAutoRenew,
          prodName: data.prodName,
          prodBeginPrice: data.prodBeginPrice.toString(),
          prodStepPrice: data.prodStepPrice.toString(),
          prodCateId: parseInt(data.prodCateId),
          prodExpired: parseInt(data.prodExpired),
        };
      } else {
        data = {
          prodImage: image,
          prodDescription: value.prodDescription,
          prodIsAutoRenew: value.prodIsAutoRenew,
          prodName: data.prodName,
          prodBeginPrice: data.prodBeginPrice.toString(),
          prodStepPrice: data.prodStepPrice.toString(),
          prodBuyPrice: data.prodBuyPrice.toString(),
          prodCateId: parseInt(data.prodCateId),
          prodExpired: parseInt(data.prodExpired),
        };
      }

      console.log(data);
      dispatch(setLoading(true));

      try {
        const res = await axios.post(
          "https://onlineauctionserver.herokuapp.com/api/seller/add-product",
          data,
          {
            headers: { authorization: accessToken },
          }
        );
        console.log("pôst bài mới: ", res);
        swal("Thành công!", "Đăng bài viết mới thành công!", "success").then(
          () => {
            window.location.reload();
          }
        );
      } catch (error) {
        console.log(error.request);
        // if (error.response.data.errorMessage)
        swal("Unsucessful!", "Có lỗi xảy ra", "error");
      }

      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="crePost__container">
        <form
          className="crePost__form"
          onSubmit={form.handleSubmit(handleOnSubmit)}
        >
          <div className="crePost__form-general">
            <div className="crePost__form--left">
              <SelectField
                form={form}
                label="Loại hàng"
                getFatherCateId={(id) => getCategoryFather(id)}
                name="prodFatherCateId"
              />
              <SelectChildCateFiled
                form={form}
                label="Mặt hàng"
                name="prodCateId"
                fatherCateId={father}
              />
              <InputField
                name="prodName"
                label="Tên sản phẩm"
                form={form}
                labelClass="form__group-label"
              />
              <NumberField
                labelClass="form__group-label"
                name="prodStepPrice"
                label="Bước nhảy"
                form={form}
              />
              <NumberField
                labelClass="form__group-label"
                name="prodBeginPrice"
                label="Giá khởi điểm"
                form={form}
              />
              <BuyNowField form={form} />
              <AutoRenew onChange={handleOnChange} />
              <NumberField
                labelClass="form__group-label"
                name="prodExpired"
                label="Thời hạn (ngày)"
                form={form}
              />
            </div>
            <div className="crePost__form--right">
              <ImageUpload
                file={image}
                onUploadImage={uploadSingleFile}
                onDeleteImage={handleDeleteImg}
              />
            </div>
          </div>

          <div className="crePost__form-detail">
            <EditorField onEditorStateChange={getDetailEditor} />
          </div>

          <input
            type="submit"
            className="crePost__form-submit"
            value="Đăng đấu giá"
          />
        </form>
      </div>
    </>
  );
}

export default CreatePost;
