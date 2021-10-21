import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import InputField from '../../../../components/formComtrol/inputField';
import { useForm } from "react-hook-form";
import NumberField from '../../../../components/formComtrol/numberField';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EditorField from './Editor';
import ImageUpload from './ImageUpload';
import BuyNowField from './BuyNowField';
import AutoRenew from './AutoRenew';
import SelectField from '../../../../components/formComtrol/selectField';

CreatePost.propTypes = {};

function CreatePost(props) {
  const [value, setValue] = useState({
    prodName: '',
    prodBeginPrice: 0,
    prodStepPrice: 0,
    prodBuyPrice: 0,
    prodIsAutoRenew: false,
    prodDescription: '',
    image: [],
  })

  const { image } = value;

  const schema = yup.object().shape({
    prodName: yup
      .string()
      .required("Product name is required").min(5, 'Min length :5'),
    prodStepPrice: yup.number().required("Price is required").positive('Must be greater than 0'),
    prodCateId: yup.number().required('Choose category!')
  });


  const form = useForm({
    defaultValues: {
      prodName: '',
      prodBeginPrice: 0,
      prodStepPrice: 0,
      prodBuyPrice: 0,
    },

    resolver: yupResolver(schema),
  });

  function uploadSingleFile(imgUpload) {
    setValue({
      ...value, image: [...image, {
        id: uuidv4(),
        src: imgUpload
      }]
    })
  }

  const handleDeleteImg = (listImg) => {
    setValue({ ...value, image: listImg })
  }

  const handleOnChange = (valueOnChange) => {
    setValue({ ...value, prodIsAutoRenew: valueOnChange });
  }

  function getDetailEditor(prodDescription) {
    setValue({ ...value, prodDescription })
  }

  const handleOnSubmit = (data) => {
    if (value.image.length >= 3) {
      data = {
        image: value.image,
        prodDescription: value.prodDescription,
        prodIsAutoRenew: value.prodIsAutoRenew,
        prodName: data.prodName,
        prodBeginPrice: parseInt(data.prodBeginPrice),
        prodStepPrice: parseInt(data.prodStepPrice),
        prodBuyPrice: parseInt(data.prodBuyPrice),
        prodCateId: data.prodCateId,
      }
    }
    console.log(data)
  }

  return <div className='crePost__container'>
    <form className='crePost__form'
      onSubmit={form.handleSubmit(handleOnSubmit)}
    >
      <div className='crePost__form-general'>
        <div className='crePost__form--left'>
          <SelectField form={form} label='Loại hàng' name='prodCateId' />
          <InputField name="prodName" label="Tên sản phẩm" form={form} labelClass='form__group-label' />
          <NumberField labelClass='form__group-label' name='prodStepPrice' label='Bước nhảy' form={form} />
          <NumberField labelClass='form__group-label' name='prodBeginPrice' label='Giá khởi điểm' form={form} />
          <BuyNowField form={form} />
          <AutoRenew onChange={handleOnChange} />

        </div>
        <div className='crePost__form--right'>
          <ImageUpload file={image} onUploadImage={uploadSingleFile} onDeleteImage={handleDeleteImg} />
        </div>
      </div>

      <div className='crePost__form-detail'>
        <EditorField onEditorStateChange={getDetailEditor} />
      </div>

      <input type='submit' className='crePost__form-submit' value='Đăng đấu giá' />
    </form>

  </div >;
}

export default CreatePost;


