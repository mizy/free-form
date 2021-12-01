import { useState, useEffect } from 'react';
import CanvasItem from './CanvasItem'

const Renderer = (props) => {
    const { schema } = props;
    return <div className="f-renderer">
        <CanvasItem schema={schema} />
    </div>
};
export default Renderer