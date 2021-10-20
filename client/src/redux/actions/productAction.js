import { ActionTypes } from "../contants/action-type";

export const get_top_5_almost_over = (products) => {
    return {
        type: ActionTypes.TOP5_PD_ARE_ALMOST_OVER,
        payload: products,
    };
};



export const get_top_5_biggest_offer = (products) => {
    return {
        type: ActionTypes.TOP5_PD_ARE_BIGGEST_OFFER,
        payload: products,
    };
};  



export const get_top_5_biggest_price = (products) => {
    return {
        type: ActionTypes.TOP5_PD_ARE_BIGGEST_PRICE,
        payload: products,
    };
};


export const list_search = (products) => {
    console.log("ListSearch",products);
    return {
        type: ActionTypes.LIST_SEARCH,
        payload: products,
    };
};



