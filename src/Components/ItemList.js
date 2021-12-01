import { useState, useEffect } from 'react';

const ItemList = (props) => {
    const { data = [] } = props;
    return <div className="item-list">
        {data.map(item => {
            return <div>{item.name}</div>
        })}
    </div>
};
export default ItemList;