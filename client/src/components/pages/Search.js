import React, { useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";




export default function Search() {


    const { text } = useParams();
    console.log("nguoi dung nhap la:",text);

    const fetchProductSearch = async () => {
        const response = await axios
            .post("https://onlineauctionserver.herokuapp.com/api/product/search", {
                "text": text,
                "orderMode": 0
            })
            .catch((err) => {
                console.log("Err", err);
            });

        console.log("dl lieu sau khi search", response.data.listProducts);
    }
   
    useEffect(() => {
        fetchProductSearch();
    });

    return (

                <>
           

                </>
    )
}