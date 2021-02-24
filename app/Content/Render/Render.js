import components from '../Components/componentsMap';
import { Form } from 'antd';
import { useContext } from 'react';
import {EventContext} from '../context';

const Render = (props) => {
	const { config = {},index, userComponents = {},style={} ,className=''} = props;
	const { onClick,onDrag } = useContext(EventContext) || {};
    const { 
        formValues,uuid,nowItem,nowEmpty,
        type, active, formItemProps, useFormItem = true,
        name,width, label, valuePropName, labelCol, wrapperCol,
        rules, component, ...others } = config;
	const Component = component || userComponents[type] || components[type]; // 支持json直接传入component
	if (!Component) return false;

	if (type === 'container') {
		return <Component.component userComponents={userComponents} config={config} />;
	}
	return useFormItem ? (
        <div  data-uuid={uuid}
            style={{style}}
            className={`item-${uuid} drag-item ${active ? 'active' : ''} ${className}`}>
            
            <div className="free-icon icon-drag" onMouseDown={(event)=>{
                event.stopPropagation();
				onDrag && onDrag(event, config);
            }} />
            <Form.Item
                onClick={(event) => {
                    event.stopPropagation();
                    onClick && onClick(event, config);
                }}
                labelCol={labelCol || props.labelCol}
                wrapperCol={wrapperCol || props.wrapperCol}
                name={name||uuid}
                label={label}
                rules={rules}
                {...formItemProps}>
                <Component.component style={{width:width||undefined}} {...others} />
            </Form.Item>
        </div>
	) : (
		<Component.component style={{width}} {...others} />
	);
};
export default Render;
