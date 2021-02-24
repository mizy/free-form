import components from '../Components';
import { Form } from 'antd';
const Render = ({ config = {}, userComponents = {} }) => {
	const { type,visible=true, useFormItem = true, name, label, formItemProps, labelCol, wrapperCol, rules, component, ...others } = config;
    if(!visible)return false;
    
    const Component = component || userComponents[type] || components[type]; // 支持json直接传入component
	if (!Component) return false;
	if (type === 'container') {
		return <Component userComponents={userComponents} {...config} />;
	}
	return useFormItem ? (
        <Form.Item 
            labelCol={labelCol} 
            wrapperCol={wrapperCol} 
            name={name} 
            label={label} 
            rules={rules} 
            {...formItemProps}>
			<Component {...others} />
		</Form.Item>
	) : (
		<Component {...others} />
	);
};
export default Render;
