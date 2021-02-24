import {
	AutoComplete,
	Checkbox,
	Cascader,
	Radio,
	Select,
	DatePicker,
	Switch,
	TimePicker,
	RadioGroup,
	Button,
	InputNumber,
	Transfer,
	TreeSelect,
	Upload,
} from 'antd';
const Input =  require('./Input');
import Container from './Container';
const map = {
	container: {
        title:"容器",
        labelCol:{
            span:8
        },
        wrapperCol:{
            span:16
        },
        component: Container,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:Container.formConfig
	},
	input: {
        title:"输入框",
        component: Input.component,
        defaultProps:{
            placeholder:"请输入"
        },
        formConfig:Input.formConfig,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
	},
	select: {
        title:"下拉框",
        component: Select,
        defaultProps:{
            placeholder:"请选择"
        },
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:require("./Select").formConfig
	},
	datePicker: {
        title:"日期选择",
        component: DatePicker,
        defaultProps:{
            placeholder:"请输入"
        },
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
	},
	switch: {
        title:"开关",
        component: Switch,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formItemProps:{
            valuePropName:"checked"
        }
	},
	// button: {
    //     title:"按钮",
	// 	component: Button,
	// },
	inputNumber: {
        title:"数字输入框",
        component: InputNumber,
        defaultProps:{
            placeholder:"请输入"
        },
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:Input.formConfig,
	},
	radioGroup: {
        title:"单选框",
        component: Radio.Group,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        defaultProps:{
            options:[{
                label:"是",
                value:true
            },{
                label:"否",
                value:false
            }]
        },
        formConfig:require("./Select").formConfig
	},
	timePicker: {
        title:"时间选择器",
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
		component: TimePicker,
	},
	transfer: {
        title:"穿梭框",
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
		component: Transfer,
	},
	upload: {
        title:"上传",
        component: Upload,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:require("./Select").formConfig
	},
	treeSelect: {
        title:"树选择器",
        component: TreeSelect,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:require("./Select").formConfig
	},
	checkboxGroup: {
        title:"多选框",
        component: Checkbox.Group,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        defaultProps:{
            options:[{
                label:"是",
                value:true
            },{
                label:"否",
                value:false
            }]
        },
        formConfig:require("./Select").formConfig
	},
	cascader: { 
        title:"级联选择器",
        component: Cascader ,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:require("./Select").formConfig
    },
	autoComplete: { 
        title:"自动回填输入框",
        component: AutoComplete,
        dataToValues:Container.dataToValues,
        valuesToData:Container.valuesToData,
        formConfig:require("./Select").formConfig
     },
};
window.componentsMap = map;
export default map;
