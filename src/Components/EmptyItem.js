import Render from '../Render'
import {Form} from 'antd';
const EmptyItem = ({children=[],direction='row',label})=>{
    return <Form.Item label={label}>
        <div className="free-form-empty-item" style={{flexDirection:direction}}>
            {children.map((item,index)=>{
                item.noStyle = true;
                return (
                    <Render key={`${item.type}_${index}`} config={item} />
                );
            })}
        </div>
    </Form.Item>
}
export default EmptyItem;