 
function ant4(data){
    const {formProps:formPropsData={}} = data;
    let formPropsContent = '';
    for(let key in formPropsData){
        if(!formPropsData[key])continue;
        formPropsContent+= `
            ${key}: ${formPropsData[key]},`
    }
    let formProps = formPropsContent!==''?`const formProps = {
        ${formPropsContent}
    }`:'';
    const page = `
    import {useState,useEffect,useRef} from 'react';
    import {Form,Select,Dropdown} from 'antd';
    const components = {
        // 这里可以定义自定义组件
    }
    const FreeForm = (props)=>{
        const { onFormRef } = props;
        const [userForm] = Form.useForm();
    
        useEffect(() => {
            // 暴露出form实例
            onFormRef&&onFormRef(userForm);
        }, []); 
    
        ${formProps}
    
        return <div className="free-form">
            <Form form={userForm} {...formProps} >
                {{#def.formItems}}
            </Form>
        </div>
    };
    export default FreeForm;
    `
    return page;
}
export default ant4;