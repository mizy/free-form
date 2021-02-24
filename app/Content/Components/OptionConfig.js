import { Button,Input,Modal,Table } from "antd";
import {useState} from 'react';
import {PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import {v1 as uuid} from 'uuid';

const OptionConfig = ({value=[],onChange})=>{
    const [visible, setVisible] = useState(false)
    const onOk = ()=>{
        setVisible(false);
    }
    const onCancel = ()=>{
        setVisible(false)
    }
    const onAdd = ()=>{
        value.push({
            key:uuid()
        });
        onChange(value.slice(0))
    }

    const onDelete=(index)=>{
        value.splice(index,1);
        onChange(value.slice(0))
    }
    const onChangeValue = (v,key,index)=>{
        value[index][key] = v;
        onChange(value.slice(0))
    }
    return <>
        <Button onClick={()=>{
            setVisible(true)
        }} size="small">配置</Button>
        <Modal
            title="选项配置"
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            rowKey="key"
        >
            <Table pagination={false} size="small" dataSource={value} >
                <Table.Column dataIndex="label" title="字段名" render={(value,r,index)=>(
                    <Input value={value} placeholder="请填写" onChange={(e)=>{onChangeValue(e.target.value,'label',index)}}></Input>
                )}></Table.Column>
                <Table.Column dataIndex="value" title="值" render={(value,r,index)=>(
                    <Input value={value} placeholder="请填写" onChange={(e)=>{onChangeValue(e.target.value,'value',index)}}></Input>
                )}></Table.Column>
                <Table.Column render={(value,res,index)=>(
                    <DeleteOutlined onClick={()=>{onDelete(index)}} />
                )}></Table.Column>
            </Table>
            <Button size="small" style={{width:"100%"}} onClick={onAdd}><PlusOutlined /> 添加</Button>
        </Modal>
    </>
}
export {OptionConfig};