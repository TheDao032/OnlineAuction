import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";




export default function Search() {

    const { text } = useParams();
    console.log("nguoi dung nhap la:", text);
    const [dataSearch, setData] = useState([]);

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
        setData(response.data.listProducts);
    }

    useEffect(() => {
        fetchProductSearch();
    });

    if (dataSearch.length === 0)
        return (
            <>
                <h1>Không tìm thấy kết quả phù hợp</h1>
            </>
        )
    return (

            dataSearch.map((product) => (
                <div>
                    <h2>{product.prodName}</h2>
                </div>
            ))
    )

}