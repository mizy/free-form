import { useEffect, useState, useRef,Fragment } from "react";
import { Input, Select, message, Modal } from "antd";
import FreeForm from '@/index';
import RuleConfig from './RuleConfig';
// 转换value为rules
const valuesToData = (values,item)=>{
    let rules = [];
    for(let key in values){
        if(key!=='otherRules'&&values[key]){
            rules.push({
                [key]:values[key]
            })
        }
    }
    if(values.otherRules){
        rules = rules.concat(values.otherRules)
    }
    item.formItemProps.rules = rules
}

function dataToValues(item){
    const {rules=[]} = item;
    const others = [];
    const values = {}
    rules.forEach(item => {
        const keys = Object.keys(item)
        if(keys.length>1){
            others.push(item)
        }else{
            values[keys[0]] = item[keys[0]];
        }
    });
    values['otherRules'] = others;
    return values;
}
let timeout;
export default props => {
    const formRef = useRef();
    const {nowItem} = props;
    const onChange = (changedValues,allValues)=>{
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            valuesToData(allValues,nowItem);
        },200);
    }

    useEffect(()=>{
        if(!nowItem)return;
        formRef.current.resetFields();
        const values = dataToValues(nowItem);
        formRef.current.setFieldsValue(values);
    },[nowItem])

    return (
        nowItem?<FreeForm 
            components={{
                'ruleConfig':RuleConfig
            }} 
            onFormRef={(form)=>{formRef.current = form;}} 
            layout="vertical" onValuesChange={onChange} 
            labelCol={{}}  config={rulesConfig} />:false
    );
};

const rulesConfig = {
    "type":"container",
    "direction":"column",
    "children":[
        {
            type:"radioGroup",
            formItemProps:{
                initialValue:false,
                name:"required",
                label:"是否必填",
            },
            props:{
                placeholder:"请填写",
                options:[{
                    label:"是",
                    value:true
                },{
                    label:"否",
                    value:false
                }]
            }
        },
        {
            type:"inputNumber",
            formItemProps:{
                name:"len",
                label:"长度",
            },
            props:{
                placeholder:"请填写",
            }
        },
        {
            type:"inputNumber",
            formItemProps:{
                name:"max",
                label:"最大长度",
            },
            props:{
                placeholder:"请填写",
            }
        },
        {
            type:"select",
            formItemProps:{
                name:"type",
                label:"值类型",
            },
            props:{
                placeholder:"请选择",
                options:[
                    {
                        label:'string',
                        value:"string"
                    },
                    {
                        label:'number',
                        value:"number"
                    },
                    {
                        label:'boolean',
                        value:"boolean"
                    },
                    {
                        label:'float',
                        value:"float"
                    },
                    {
                        label:'integer',
                        value:"integer"
                    },
                    {
                        label:'date',
                        value:"date"
                    },
                    {
                        label:'url',
                        value:"url"
                    },{
                        label:"email",
                        value:"email"
                    }
                ]
            }
        },
        {
            type:"switch",
            formItemProps:{
                name:"whitespace",
                initialValue:false,
                label:"支持提交空格",
                tooltip:"是否支持字段仅包含空格则校验不通过",
                valuePropName:"checked"
            },
            props:{
            }
        },
        {
            type:"ruleConfig",
            formItemProps:{
                label:"其他规则配置",
                name:"otherRules",
                tooltip:"配置其他自定义规则"
            },
            props:{
            }
        }
        
    ]
}