import { useEffect, useState, Fragment,useRef } from "react";
import FormConfig from './FormConfig/FormConfig';
import { Input, Select, message, Modal,Tooltip } from "antd";
import {SettingOutlined,ExportOutlined,ImportOutlined,CodeOutlined} from '@ant-design/icons';
import ant4 from './CodeConvert/ant4'
let input;
export default props => {
    const formConfig = useRef();

    const showFormConfig = ()=>{
        formConfig.current.setModalVisible(true);
    }

    const onExport = ()=>{
        
        Modal.info({
            title:"JSON数据",
            content:<Input.TextArea
                style={{height:300}}
                value={JSON.stringify(props.context.data,' ',4)}
                >
            </Input.TextArea>
        })
    }
    const onImport = ()=>{
        Modal.confirm({
            title:"导入JSON数据",
            content:<Input.TextArea
                ref={ref=>input = ref}
                style={{height:300}}
                >
            </Input.TextArea>,
            onOk:()=>{
                const value = input.resizableTextArea.textArea.value;
                props.context.setData(JSON.parse(value));
            }
        })
    }
    const onExportCode = ()=>{
        const data = ant4(props.context.data);
        Modal.info({
            title:"JSON数据",
            content:<Input.TextArea
                style={{height:300}}
                value={data}
                >
            </Input.TextArea>
        })
    }
    return (
        <div className="editor-top">
            <div className="title">FreeForm</div>
            <div className="handle-area">
                <Tooltip title="导入"><div onClick={onImport}><ImportOutlined /></div></Tooltip>
                <Tooltip title="导出"><div onClick={onExport}><ExportOutlined /></div></Tooltip>
                <Tooltip title="导出代码"><div onClick={onExportCode}><CodeOutlined /></div></Tooltip>
                <Tooltip title="全局表单配置"><div onClick={showFormConfig}><SettingOutlined /></div></Tooltip>
            
            </div>
            <FormConfig  context={props.context} onRef={ref=>{formConfig.current = ref}} />

        </div>
    );
};
