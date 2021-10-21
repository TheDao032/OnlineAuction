import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RiDeleteBin6Fill, RiEditFill } from "react-icons/ri";


AdminCategory.propTypes = {};


const deleteCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#ff7b7b',
  marginRight: '8px',
  color: '#333'
}

const editCss = {
  cursor: 'pointer',
  fontSize: '20px',
  padding: '8px 8px 8px 8px',
  borderRadius: '3px',
  background: '#48bf91',
  color: '#333'
}

function AdminCategory(props) {
  let catArr = [
    {
      id: 1,
      name: 'AO',
      price: 22.1,
      dateEnd: 'Hôm nay',
    },
    {
      id: 2,
      name: 'QUAN LOT',
      price: 20,
      dateEnd: 'Hôm nay',
    },
    {
      id: 3,
      name: 'QUAN JOKKER QUAN JOKKER QUAN JOKKER QUAN JOKKER QUAN JOKKER QUAN JOKKER',
      price: 22.1,
      dateEnd: 'Ngày mai',
    },
    {
      id: 4,
      name: 'AO KHOAC',
      price: 221.1,
      dateEnd: 'Hôm kia',
    },
    {
      id: 5,
      name: 'QUAN DAI',
      price: 30.1,
      dateEnd: 'Hôm trước',
    },
  ]

  const [arr, setArr] = useState(() => catArr)

  const handleDelete = (id) => {
    const newArr = arr.filter(item => item.id !== id)
    setArr(newArr)
  }


  return <section className="admin">
    <div className="tbl-header">
      <table className='admin__table'>
        <thead className='admin__thead'>
          <tr className='admin__tr'>
            <th>Code</th>
            <th>Name</th>
            <th>Price</th>
            <th>Date end</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>
    </div>
    <div className="tbl-content">
      <table className='admin__table'>
        <tbody className='admin__tbody'>
          {arr.map(item => {
            return (
              <tr className='admin__tr' key={item.id}>
                <td>{item.id}</td>
                <td>
                  <span className='admin__td-name'>
                    {item.name}
                  </span>
                </td>
                <td>${item.price}</td>
                <td>{item.dateEnd}</td>
                <td>
                  <div style={deleteCss} onClick={() => handleDelete(item.id)}>
                    <RiDeleteBin6Fill />
                  </div>
                  <div style={editCss}>
                    <RiEditFill />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </section>
}

export default AdminCategory;
