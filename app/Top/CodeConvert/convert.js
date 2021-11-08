import { useState, useEffect, useRef } from "react";
import { Form, Select, Dropdown } from "antd";

const FreeForm = Form.create()((props) => {
    const { form } = props;
    const { getFieldDecorator } = form;
    // 表单属性
    const formProps = {};
    return (
        <div className="free-form">
            <Form {...formProps}>
                <div
                    className="form-item-container"
                    style={{
                        display: "flex",
                        flexDirection: "undefined",
                    }}
                >
                    <Form.Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 8 }}
                        label={"测试"}
                        rules={[{ required: true }]}
                        wrapperCol={{ span: 8 }}
                        labelCol={{ span: 8 }}
                    >
                        {getFieldDecorator("undefined", {
                            rules: [{ required: true }],
                        })(<Select placeholder={"请选择"} />)}
                    </Form.Item>

                    <Select placeholder={"请选择"} />
                </div>
            </Form>
        </div>
    );
});
export default FreeForm;
