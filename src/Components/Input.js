import {Input} from 'antd';
const input = (props)=>{
    const {inputType,...others} = props;
    let Component = Input[inputType]||Input; 
    return <Component {...others} />
} 
export default input;