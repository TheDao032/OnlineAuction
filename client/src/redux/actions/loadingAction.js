import { ActionTypes } from '../contants/action-type';

export const setLoading = (state) => {
  // Này chạy trước xong nó đưa payload vô cái reducer
  console.log('state nhận được', state);
  return {
    type: ActionTypes.LOADING,
    payload: state,
  };
};
