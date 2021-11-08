import prettier from "prettier/esm/standalone.mjs";
import parserBabel from "prettier/esm/parser-babel.mjs";

function ant3(data) {
    const { formProps } = data;

    let page =
        `import {useState,useEffect,useRef} from 'react';
import {Form,Select,Dropdown} from 'antd';

const FreeForm = Form.create()((props)=>{
    const { form } = props;
    const { getFieldDecorator } = form;
    // 表单属性
$formProps
    return <div className="free-form">
        <Form {...formProps} >
$components
        </Form>
    </div>
});
export default FreeForm;
`
    page = page.split('\n');
    getFormProps(formProps, page);
    getComponents(data, page)
    const pageStr = page.join("\n");
    const code = prettier.format(pageStr, {
        parser: "babel",
        plugins: [parserBabel]
    })
    return code

}

function getFormProps(formPropsData, page) {
    let formPropsContent = [
        'const formProps = {',
    ];
    for (let key in formPropsData) {
        if (!formPropsData[key]) continue;
        formPropsContent.push(`    ${key}: ${JSON.stringify(formPropsData[key])},`)
    }
    formPropsContent.push('}');
    for (let i in formPropsContent) {
        formPropsContent[i] = '    ' + formPropsContent[i];
    }
    const index = page.indexOf('$formProps');
    page.splice(index, 1, ...formPropsContent);
    return page
}
function getComponents(data, page) {
    const { config } = data;
    const res = [];
    makeRender(data, res)
    const index = page.indexOf('$components');
    page.splice(index, 1, ...res);
}

function makeRender(config, res) {
    const { type } = config;
    if (type === 'container') {
        makeContainer(config, res);
    } else {
        makeComponent(config, res)
    }
}

function makeContainer(config, res) {
    const { direction, widthRatio, wrap } = config;
    res.push(`<div className="form-item-container" style={{
        display:'flex',
        flexDirection: '${direction}',
        ${widthRatio ? (`width:'${widthRatio}%',`) : ''}
        ${wrap ? `flexWrap:'wrap'` : ''}
    }} >`)
    config.children.forEach(item => {
        const { formItemProps = {} } = item;
        if (config.wrapperCol && !formItemProps.wrapperCol) {
            formItemProps.wrapperCol = config.wrapperCol
        }
        if (config.labelCol && !formItemProps.labelCol) {
            formItemProps.labelCol = config.labelCol
        }
        item.formItemProps = formItemProps;
        makeRender(item, res);
    })
    res.push(`</div>`)
}

function makeComponent(config, res) {
    const { type, width,
        formItemProps = {}, useFormItem = true, props } = config;
    const { name, rules = [] } = formItemProps;
    const formItemPropsCode = [];
    for (let key in formItemProps) {
        if (!formItemProps[key]) continue;
        formItemPropsCode.push(`${key}={${JSON.stringify(formItemProps[key])}}`)
    }
    const componentName = type[0].toUpperCase() + type.substr(1);
    const propsCode = [
        width ? `style={{width:${width}}}` : '',
    ]
    for (let key in props) {
        if (!props[key]) continue;
        propsCode.push(`${key}={${JSON.stringify(props[key])}}`)
    }
    if (useFormItem) {
        res.push(`
            <Form.Item  ${formItemPropsCode.join(' ')}  >
            { getFieldDecorator("${name}", {
                rules: ${JSON.stringify(rules)}
            })(
                <${componentName} ${propsCode.join(' ')} />
            )}
            </Form.Item>
        `)
        res.push(`<${componentName} ${propsCode.join(' ')} />`);
    } else {
        res.push(`<${type} ${propsCode.join(' ')} />`);
    }
}

export default ant3;
