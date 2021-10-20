import { combineReducers } from 'redux';
import { categoryReducer } from './categoryReducer';
import { productReducer } from './productReducer';

const reducers = combineReducers({
    allCategorys: categoryReducer,
    top5Almost: productReducer,
});

export default reducers;