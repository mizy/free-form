import { useEffect, useState,useRef,useMemo, Fragment, Component } from "react";
import { Input,Button, Select, message, Modal,Tabs } from "antd";
import FreeForm from '@/index'
import Components from '../Content/Components/componentsMap';
import {OptionConfig} from '../Content/Components/OptionConfig';
import Rules from './Rules';
let timeout;
export default props => {
    const [nowItem,setNowItem] = useState();
    const [tab,setTab] = useState(0);
    const formConfig = useRef();
    const formRef = useRef();

    useEffect(() => {
        props.context.right = {
            onSelect
        }
    }, []);

    const onSelect = (item)=>{
        setNowItem(item);
    }

    const onChange = (changedValues,allValues)=>{
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            const {valuesToData} = Components[nowItem.type];
            valuesToData(allValues,nowItem);
            props.context.render()
        },200);
    }
 

    useEffect(()=>{
        if(!nowItem)return;
        formRef.current.resetFields();
        const {dataToValues} = Components[nowItem.type];
        const values = dataToValues(nowItem);
        formRef.current.setFieldsValue(values);
    },[nowItem])
    return (
        <div className="editor-right">
            <div className="title-tab">
                <div className={tab===0?'active':''} onClick={()=>{setTab(0)}}> 属性 </div>
                <div className={tab===1?'active':''} onClick={()=>{setTab(1)}}> 校验 </div>
            </div>
            <div className="props-content">
                <div style={{display:tab===0?'block':"none"}}>
                    <FreeForm 
                        components={{
                            'optionConfig':OptionConfig
                        }} 
                        colon={true}
                        onFormRef={(form)=>{formRef.current = form;}} 
                        layout="vertical" onValuesChange={onChange} 
                        labelCol={{}}  config={nowItem?Components[nowItem.type].formConfig:{}} />
                </div>
                <div style={{display:tab===1?'block':"none"}}>
                    <Rules nowItem={nowItem} {...props} />
                </div>
            </div>
        </div>
    );
};