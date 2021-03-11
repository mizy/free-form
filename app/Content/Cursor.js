
import {observer} from 'mobx-react';
const Cursor = ({status,style})=>{
    return status.current==="dragging"?<div className="cursor" style={{...style}}></div>:null
}

export default observer(Cursor);