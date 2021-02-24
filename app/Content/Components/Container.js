import Render from '../Render/Render'
import { EventContext } from '../context';
import { Fragment, useContext ,useRef} from 'react';

const Container = ({ config = {}, userComponents }) => {
    const { children = [],wrap,uuid,widthRatio,active, direction = 'column', labelCol,nowEmpty, wrapperCol } = config;
    const { onMouseUp,onClick,onDrag } = useContext(EventContext) || {};
    const className = "free-form-container free-container-"+direction + `${active?' active':''} item-${config.uuid}`;
    return <div
        data-uuid={config.uuid}
        className={className}
        style={{ 
            flexDirection: direction,
            width:widthRatio?(widthRatio+'%'):'auto',
            flexWrap:wrap?"wrap":"nowrap" 
        }}
        
        onMouseUp={(event) => {
            onMouseUp&&onMouseUp(event, config)
        }}
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
            name:"direction",
            label:"布局方向",
            formItemProps:{
                initialValue:"column"
            },
            options:[{
                label:"纵向",
                value:"column"
            },{
                label:"横向",
                value:"row"
            }]
        },
        {
            type:"slider",
            name:"labelCol",
            label:"文字栅格",
            // dots:true,
            formItemProps:{
                initialValue:8
            },
            max:24,
            min:0
        },
        {
            type:"slider",
            name:"wrapperCol",
            label:"组件栅格",
            formItemProps:{
                initialValue:16
            },
            // dots:true,
            max:24,
            min:0
        },
        {
            type:"slider",
            name:"widthRatio",
            label:"容器宽度(%)",
            formItemProps:{
                tooltip:"当前容器占父容器的宽度百分比"
            },
            // dots:true,
            max:100,
            min:0
        },
        {
            type:"switch",
            name:"wrap",
            label:"自动换行",
            formItemProps:{
                valuePropName:"checked",
                initialValue:false,
                tooltip:"是否自动换行,等同于flex-wrap"
            },
            // dots:true,
             
        },
    ]
}
Container.dataToValues = function(data){
    let {wrapperCol,labelCol,uuid,active,children,...values} = data;
    if(wrapperCol){
        values.wrapperCol = wrapperCol.span
    }
    if(labelCol){
        values.labelCol = labelCol.span
    }
    return values
},
Container.valuesToData = (allValues,data)=>{
    for(let key in allValues){
        if(allValues[key]!==undefined){
            let value = allValues[key];
            if(key==="wrapperCol"||key==="labelCol"){
                value = {span:value}
            }
            data[key] = value;
        }
    }
    console.log(data)
}
export default Container;