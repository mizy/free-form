import {Input} from 'antd';
import {action} from 'mobx';
const component = (props)=>{
    const {inputType,...others} = props;
    let Component = Input[inputType]||Input; 
    return <Component {...others} />
}
const formConfig =  {
    "type":"container",
    "direction":"column",
    "children":[
        {
            type:"input",
            name:"name",
            label:"字段名",
            formItemProps:{
                
            },
            placeholder:"提交的字段名称",
        },
        {
            type:"input",
            name:"label",
            label:"表单名",
            formItemProps:{
                initialValue:"测试"
            },
            placeholder:"表单描述的文字",
        },
        {
            type:"inputNumber",
            name:"width",
            label:"宽度",
            formItemProps:{
                
            },
            placeholder:"默认不填为栅格宽度",
        },
        {
            type:"radioGroup",
            name:"inputType",
            label:"类型",
            formItemProps:{
                initialValue:"default"
            },
            options:[{
                label:"默认",
                value:"default"
            },{
                label:"密码",
                value:"Password"
            },{
                label:"文本",
                value:"TextArea"
            },{
                label:"检索",
                value:"Search"
            }]
        },
        {
            type:"inputNumber",
            name:"maxLength",
            label:"最大长度",
            formItemProps:{
                
            }, 
            placeholder:"输入框最大输入长度",
        },
        {
            type:"switch",
            name:"allowClear",
            label:"允许清除",
            formItemProps:{
                valuePropName:"checked"
            },
            // dots:true,
        }
    ]
}
const dataToValues = function(data){
    let {formItemProps:{wrapperCol,labelCol,name,label},props={}} = data;
    let values = {...props,name,label};
    if(wrapperCol){
        values.wrapperCol = wrapperCol.span
    }
    if(labelCol){
        values.labelCol = labelCol.span
    }
    return values
};
const valuesToData = action((allValues,data)=>{
    const {wrapperCol,labelCol,name,label,width,...props} = allValues;
    if(wrapperCol){
        data.formItemProps.wrapperCol = wrapperCol;
    }
    if(labelCol){
        data.formItemProps.labelCol = labelCol;
    }
    data.formItemProps.name = name;
    data.formItemProps.label = label;
    data.width = width;
    for(let key in props){
        if(props[key]!==undefined)
        data.props[key] = props[key];
    }
})
module.exports = {formConfig,component,dataToValues,valuesToData}