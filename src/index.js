import {useState,useEffect} from 'react';
import {Form,Select,Dropdown} from 'antd';
import Render from './Render';
import './index.less';
import {useRef} from 'react';

const FreeForm = (props)=>{
    const { form, config={},components,children,onRef,onFormRef,...formProps} = props;
    let [userForm] = Form.useForm();
    userForm = form?form:userForm;
    useEffect(() => {
        onFormRef&&onFormRef(userForm);
        onRef&&onRef({
            
        });
    }, []); 
   
    const {formConfig} = config;
    return <div className="free-form">
        <Form form={userForm} labelCol={{span:4}} {...formConfig} {...formProps} >
            <Render userComponents={components} config={config} />
            {children}
        </Form>
    </div>
};
export default FreeForm