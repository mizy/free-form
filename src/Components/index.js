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
    Slider,
	Transfer,
	TreeSelect,
	Upload,
} from 'antd';
import input from './Input';
import Container from './Container';
const map = {
	container: Container,
	input,
	select: Select,
	datePicker: DatePicker,
	switch: Switch,
	button: Button,
	inputNumber: InputNumber,
	radioGroup: Radio.Group,
	timePicker: TimePicker,
	transfer: Transfer,
	upload: Upload,
	treeSelect: TreeSelect,
	checkboxGroup: Checkbox.Group,
    cascader: Cascader,
    slider:Slider,
	autoComplete: AutoComplete,
};
export default map;
