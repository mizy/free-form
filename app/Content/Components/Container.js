import Render from '../Render/Render'
import { EventContext } from '../context';
import { Fragment, useContext ,useEffect,useRef} from 'react';
import {observer} from 'mobx-react';
import { action } from 'mobx';
const Container = ({ config = {}, userComponents }) => {
    const { children = [],wrap,uuid,widthRatio,active, direction = 'column', labelCol,nowEmpty, wrapperCol } = config;
    const { onMouseUp,onClick,onDrag } = useContext(EventContext) || {};
    const className = "free-form-container free-container-"+direction + `${active?' active':''} item-${config.uuid} ${config.hover?'hover':''}`;
     
    return <div
        data-uuid={config.uuid}
        className={className}
        style={{ 
            flexDirection: direction,
            width:widthRatio?(widthRatio+'%'):'auto',
            flexWrap:wrap?"wrap":"nowrap" 
        }} 
        onMouseOver={action((e)=>{
            e.stopPropagation();
            config.hover = true;
        })}
        onMouseOut={action((e)=>{
            e.stopPropagation();
            config.hover = false
        })}
        onMouseDown={(event)=>{
            if(!config.isRoot){
                event.stopPropagation();
            }
        }}
        onClick={(event)=>{
            event.stopPropagation();
            onClick&&onClick(event,config);
        }}>
             {!config.isRoot?<div key="drag" className="free-icon icon-drag" onMouseDown={(event)=>{
                event.stopPropagation();
				onDrag && onDrag(event, config);
            }} />:null}
            {children.map((item,index) => {
                return <Fragment key={item.uuid}>
                    <Render key={item.uuid} userComponents={userComponents} labelCol={labelCol} wrapperCol={wrapperCol} config={item} />
                </Fragment>;
            })}
    </div>
}
Container.formConfig = {
    "type":"container",
    "direction":"column",
    "children":[
        {
            type:"radioGroup",
            formItemProps:{
                name:"direction",
                label:"布局方向",
                initialValue:"column"
            },
            props:{
                options:[{
                    label:"纵向",
                    value:"column"
                },{
                    label:"横向",
                    value:"row"
                }]
            }
        },
        {
            type:"slider",
            formItemProps:{
                name:"labelCol",
                label:"文字栅格",
                initialValue:8
            },
            props:{
                max:24,
                min:0
            }
        },
        {
            type:"slider",
            formItemProps:{
                initialValue:16,
                name:"wrapperCol",
                label:"组件栅格",
            },
            props:{
                max:24,
                min:0
            }
        },
        {
            type:"slider",
            formItemProps:{
                name:"widthRatio",
                label:"容器宽度(%)",
                tooltip:"当前容器占父容器的宽度百分比"
            },
            props:{
                max:100,
                min:0
            }
        },
        {
            type:"switch",
            formItemProps:{
                valuePropName:"checked",
                initialValue:false,
                tooltip:"是否自动换行,等同于flex-wrap",
                name:"wrap",
                label:"自动换行",
            },
            props:{

            }
        },
    ]
}
Container.dataToValues = action(function(data){
    let {wrapperCol,labelCol,uuid,active,children,...values} = data;
    if(wrapperCol){
        values.wrapperCol = wrapperCol.span
    }
    if(labelCol){
        values.labelCol = labelCol.span
    }
    return values
}),
Container.valuesToData = action((allValues,data)=>{
    for(let key in allValues){
        if(allValues[key]!==undefined){
            let value = allValues[key];
            if(key==="wrapperCol"||key==="labelCol"){
                value = {span:value}
            }
            data[key] = value;
        }
    }
})
export default observer(Container);