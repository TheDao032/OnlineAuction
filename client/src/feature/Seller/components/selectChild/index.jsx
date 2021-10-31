import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../../../redux/actions/loadingAction';

SelectChildCateFiled.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClass: PropTypes.string,
};

SelectChildCateFiled.defaultTypes = {
  label: '',
  disabled: false,
};

function SelectChildCateFiled(props) {
  const { form, name, label, disabled, labelClass, fatherCateId = null } = props;

  const [subCate, setSubCate] = useState(null)
  const dispatch = useDispatch();

  const {
    formState: { errors },
  } = form;

  const hasError = errors[name]?.message;

  const fetchChildCategory = async () => {
    dispatch(setLoading(true));
    try {
      console.log('vooooooooooooooo');

      const response = await axios.post(
        'https://onlineauctionserver.herokuapp.com/api/categories/list-child', {
        cateFather: parseInt(fatherCateId)
      }
      );
      setSubCate(response.data.subCategories)

    } catch (error) {
      console.log('ccc', error.response);
    }

    dispatch(setLoading(false));
  }

  useEffect(() => {
    if (fatherCateId !== null) {
      fetchChildCategory()
    }
  }, [fatherCateId])

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
        field,
        field: { onChange, onBlur, value, name },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <div>
          <p className='form__group-helperText'>{!!hasError && hasError}</p>
          <div className='form__group'>
            <label className='form__group-label'>{label}</label>
            <select className='form__group-select'
              style={{
                border: `${!!hasError ? '1px solid red' : '1px solid black'}`
              }}
              onChange={onChange}
              onBlur={onBlur}
              value={value}>

              <option selected disabled>Chọn mặt hàng</option>
              {
                subCate?.map((item) => <option value={item.cateId}>{item.cateName}</option>)
              }
            </select>
          </div>
        </div>
      )}
    ></Controller>
  );
}

export default SelectChildCateFiled;
