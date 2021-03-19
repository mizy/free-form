import { useEffect, useState,useRef, Fragment } from "react";
import { Input, Select, message, Modal } from "antd";
import FreeForm from '@';
import validateMessages from './validateMessage';
const config = {
    "type":"container",
    "direction":"column",
    "children":[
        {
            type:"radioGroup",
            formItemProps:{
                name:"layout",
                label:"布局",
            },
            props:{
                options:[{
                    label:"纵向",
                    value:"vertical"
                },{
                    label:"横向",
                    value:"horizontal"
                },{
                    label:"单行",
                    value:"inline"
                }]
            }
        },
        {
            type:"slider",
            formItemProps:{
                name:"labelCol",
                label:"文字栅格",
            },
            props:{
                max:24,
                min:0
            }
        },
        {
            type:"slider",
            formItemProps:{
                name:"wrapperCol",
                label:"组件栅格",
            },
            props:{
                max:24,
                min:0
            }
        },
        {
            type:"switch",
            formItemProps:{
                name:"colon",
                label:"分号",
                valuePropName:"checked"
            },
            props:{
                defaultChecked:true,
                checkedChildren:"显示",
                unCheckedChildren:"隐藏"
            },
        },
        {
            type:"input",
            formItemProps:{
                name:"width",
                label:"宽度",
            },
            props:{
                placeholder:"不填默认为自适应"
            }
        },
        {
            type:"input",
            formItemProps:{
                name:"height",
                label:"高度",
            },
            props:{
                placeholder:"不填默认为自适应"
            }
        },{
            type:"input",
            props:{
                inputType:"TextArea",
                placeholder:"默认报错校验文案",
            },
            formItemProps:{
                label:"校验文案",
                name:"validateMessages",
                initialValue:JSON.stringify(validateMessages,' ',4)
            }
        }

    ]
}
const HookModal = props => {
    const {context} = props;
    const [modalVisible, setModalVisible] = useState(false);
    const {onRef} = props;
    const formRef = useRef();
    useEffect(() => {
        onRef&&onRef({
            setModalVisible
        })
    }, []);

    const onOk = () => {
        context.data.formProps = formRef.current.getFieldsValue();
        if(context.data.formProps.layout==="inline"){
            // 当表单布局改为一行时，根容器也对应改成一行，减少操作
            context.data.direction='row'
        }
        try{
            const data = JSON.parse(context.data.formProps.validateMessages);
            context.data.formProps.validateMessages = data;
            setModalVisible(false)
        }catch (e){
            message.error("校验信息填写有误，请确保为json")
        }
       
     };
    const onCancel = () => { 
        setModalVisible(false)
    };

    return (
        <div className="hook-modal">
            <Modal
                title="全局配置"
                visible={modalVisible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <FreeForm onFormRef={ref=>{formRef.current=ref}} initialValues={{
                    layout:'horizontal'
                }}  config={config} />
            </Modal>
        </div>
    );
};

export default  HookModal
