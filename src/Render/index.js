import components from '../Components';
import { Form } from 'antd';
const Render = (parentProps) => {
    const { config = {}, userComponents = {} } = parentProps;
	const { type,visible=true, useFormItem = true, props={}, formItemProps={}, labelCol, wrapperCol, component} = config;
    if(!visible)return false;
    
    const Component = component || userComponents[type] || components[type]; // 支持json直接传入component
	if (!Component) return false;
	if (type === 'container') {
		return <Component userComponents={userComponents} {...config} />;
	}
	return useFormItem ? (
        <Form.Item 
            labelCol={labelCol || parentProps.labelCol}
            wrapperCol={wrapperCol || parentProps.wrapperCol}
            {...formItemProps}>
			<Component {...props} />
		</Form.Item>
	) : (
		<Component {...props} />
	);
};
export default Render;
