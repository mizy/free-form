import {useState,useEffect, useRef} from 'react';
import {Form,Select,Dropdown} from 'antd';
import Render from './Render/Render';
import './Parser.less';

const Parser = (props)=>{
    const { config={},components,children,onRef,onFormRef,...formProps} = props;
    const [form] = Form.useForm();
    useEffect(() => {
        onRef&&onRef({
            
        })
    }, []); 
    return <div className="free-parse-form">
        <Form form={form} labelCol={{span:4}} {...formProps}>
            <Render userComponents={components} config={config} />
            {children}
        </Form>
    </div>
};
export default Parser