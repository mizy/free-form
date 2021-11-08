import { useEffect, useState, Fragment, useRef } from "react";
import FormConfig from './FormConfig/FormConfig';
import { Input, Select, message, Modal, Tooltip } from "antd";
import { SettingOutlined, ExportOutlined, ImportOutlined, CodeOutlined } from '@ant-design/icons';
import ant4 from './CodeConvert/ant4'
import ant3 from './CodeConvert/ant3'
let input;
export default props => {
    const formConfig = useRef();

    const showFormConfig = () => {
        formConfig.current.setModalVisible(true);
    }

    const onExport = () => {

        Modal.info({
            title: "JSON数据",
            content: <Input.TextArea
                style={{ height: 300 }}
                value={JSON.stringify(props.context.data, ' ', 4)}
            >
            </Input.TextArea>
        })
    }
    const onImport = () => {
        Modal.confirm({
            title: "导入JSON数据",
            content: <Input.TextArea
                ref={ref => input = ref}
                style={{ height: 300 }}
            >
            </Input.TextArea>,
            onOk: () => {
                const value = input.resizableTextArea.textArea.value;
                props.context.setData(JSON.parse(value));
            }
        })
    }
    const onExportCode = (func) => {
        const data = (func === 'ant4' ? ant4 : ant3)(props.context.data);
        Modal.confirm({
            title: "代码",
            onOk: () => {
                download([data])
            },
            content: <Input.TextArea
                style={{ height: 300, width: 800 }}
                value={data}
            >
            </Input.TextArea>
        })
    }
    function download(data) {
        const blob = new Blob(data);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'FreeForm.js';
        a.href = url;
        a.style.display = 'none';
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url)
    }
    return (
        <div className="editor-top">
            <div className="title">FreeForm</div>
            <div className="handle-area">
                <Tooltip title="导入"><div onClick={onImport}><ImportOutlined /></div></Tooltip>
                <Tooltip title="导出"><div onClick={onExport}><ExportOutlined /></div></Tooltip>
                <Tooltip title="导出代码"><div onClick={() => onExportCode('ant4')}><CodeOutlined /></div></Tooltip>
                <Tooltip title="导出ant3代码"><div onClick={() => onExportCode('ant3')}><CodeOutlined /></div></Tooltip>
                <Tooltip title="全局表单配置"><div onClick={showFormConfig}><SettingOutlined /></div></Tooltip>

            </div>
            <FormConfig context={props.context} onRef={ref => { formConfig.current = ref }} />

        </div>
    );
};
