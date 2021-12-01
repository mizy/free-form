import { useState, useEffect } from 'react';
import { observer } from 'mobx-react'
const componentsMap = {};
const instanceMap = {};

const CanvasItem = (props) => {
    const { schema } = props;
    if (!schema) return false;

    const children = typeof schema.children === 'object' ? schema.children.map(item => {
        return <CanvasItem key={item.id} schema={item} />
    }) : (schema.children || false);

    if (!componentsMap[schema.type]) {
        return React.createElement(
            schema.type,
            { style: { ...schema.style }, id: schema.id },
            children
        )
    }
    const Compoennt = componentsMap[schema.type];
    return <Compoennt {...schema}>
        {children}
    </Compoennt>
};
export default observer(CanvasItem)