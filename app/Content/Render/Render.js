import components from '../Components/componentsMap';
import { Form } from 'antd';
import { useContext } from 'react';
import {EventContext} from '../context';
import {observer} from 'mobx-react';
import {action} from 'mobx'

const Render = (props) => {
	const { config = {},index, userComponents = {},style={} ,className=''} = props;
	const { onClick,onDrag } = useContext(EventContext) || {};
    const { 
        formValues,uuid,type,  width,
        active, formItemProps={}, useFormItem = true,hover,
        rules, component,props:componentProps, ...others } = config;
    const {wrapperCol,labelCol,name} = formItemProps;
	const Component = component || userComponents[type] || components[type]; // 支持json直接传入component
	if (!Component) return false;

	if (type === 'container') {
		return <Component.component userComponents={userComponents} config={config} />;
	}
	return useFormItem ? (
        <div data-uuid={uuid}
            style={{style}}
            onMouseOver={action((e)=>{
                e.stopPropagation();
                config.hover = true;
            })}
            onMouseOut={action((e)=>{
                e.stopPropagation();
                config.hover = false
            })}
            className={`item-${uuid} drag-item ${active ? 'active' : ''} ${hover?'hover':''} ${className}`}>
            
            <div className="free-icon icon-drag" onMouseDown={(event)=>{
                event.stopPropagation();
				onDrag && onDrag(event, config);
            }} />
            <Form.Item
                onClick={(event) => {
                    event.stopPropagation();
                    onClick && onClick(event, config);
                }}
                {...formItemProps}
                labelCol={labelCol || props.labelCol}
                wrapperCol={wrapperCol || props.wrapperCol}
                name={name||uuid}>
                <Component.component {...componentProps} style={{width:width||undefined}} {...others} />
            </Form.Item>
        </div>
	) : (
		<Component.component style={{width}} {...others} />
	);
};
export default observer(Render);
