import React from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";


export default function Detail() {

    const { prodId } = useParams(); 
    // const dispatch = useDispatch();

    const fetchProductDetail = async() =>{
        const response = await axios
            .post("https://onlineauctionserver.herokuapp.com/api/product/detail", {
                "prodId": parseInt(prodId),
            })
            .catch((err) => {
                console.log("Err", err);
            });
    
         console.log("dsadas", response.data.productDetail);
    }

    useEffect(() => {
       fetchProductDetail();
       
    })
    return (
        <>
            Details

        </>
    )
}