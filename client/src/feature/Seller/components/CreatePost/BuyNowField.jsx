import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NumberField from '../../../../components/formComtrol/numberField';

BuyNowField.propTypes = {
  form: PropTypes.object,
};

function BuyNowField({ form = {} }) {
  const [buyNow, setBuyNow] = useState(false)

  const onChangeSelected = (e) => {
    let { value } = e.target

    if (value === 'true') setBuyNow(true)
    else setBuyNow(false)
  }

  return (
    <>
      <div className='form__group' >
        <p className='form__group-label' style={{ padding: '5px 0' }}>Mua ngay?</p>
        <div className='form__group-radio'>
          <div>
            <input type="radio" id="buyNow" name="isBuyNow" value={true} onChange={onChangeSelected} />
            <label for="buyNow" style={{ marginLeft: '5px' }}>Có</label>
          </div>
          <div>
            <input type="radio" id="notBuyNow" name="isBuyNow" value={false} onChange={onChangeSelected} defaultChecked />
            <label for="notBuyNow" style={{ marginLeft: '5px' }}>Không</label>
          </div>
        </div>
      </div>
      {
        buyNow && <NumberField labelClass='form__group-label' name='prodBuyPrice' label='Giá mua ngay' form={form} />
      }
    </>
  )
}

export default BuyNowField;
