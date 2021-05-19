import React from 'react';
import './Table.css';

const Table = ({ countries }) => {
    return (
        <div className="table">
            {
                //Destructuring
                countries.map(( {country, cases }) => {
                  return <tr>
                        <td>{country}</td>
                        <td>
                        <strong>{cases}</strong>
                        </td>
                    </tr>
                })
            }
        </div>
    )
}

export default Table;
