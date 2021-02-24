import { useEffect, useState, Fragment } from "react";
import { Input,Form, Select, message, Modal } from "antd";

export default props => {

    return (<div style={{display:"flex"}}>
                <Form.Item noStyle className="hook-page">
                    <Input style={{marginRight:10,width:150}}  />
                </Form.Item>
                <Form.Item noStyle className="hook-page">
                    <Input style={{width:150}}  />
                </Form.Item>
            </div>
    );
};
