import { useEffect,useRef, useState, Fragment } from "react";
import { Input, Select, message, Modal } from "antd";
import {v1 as uuid1} from 'uuid';
import Parser from './Parser';
import {EventContext} from './context';
let itemRectCache = {};
let cursorTimeout;
export default props => {
    const { data,context } = props;
    const [state,setState] = useState();
    const [cursor,setCursor] = useState({});
    const dom = useRef();
    const activeItem = useRef();
    const status= useRef('ended')
    const dragItem = useRef();
    const _this = useRef({
        onDragStart:()=>{
            status.current = ("dragging");
            setState([])
        },
        onDragEnd:()=>{
            status.current = ("ended");
            setState([])
        },
        // 移动逻辑
        onMoveDrop (event,item,uuid){
            // 解除事件绑定
            if(status.current !=='dragging')return;
            if(item){
                context.removeItem(dragItem.current.config);
                if(!item.children)item.children = [];
                context.center.addItemByUuid(item,dragItem.current.config,uuid)
            }
            // 还原回去，否则react会找不到对应的parent报错
            dragItem.current.parent.appendChild(dragItem.current.dom);
            // 清理样式
            dragItem.current.config.nowEmpty = undefined;
            dragItem.current.dom.style.left = 'auto';
            dragItem.current.dom.style.top = 'auto';
            dragItem.current.dom.style.pointerEvents='auto';
            document.body.style.cursor = 'auto';
            dragItem.current.dom.classList.remove('form-item-ondrag');
            dragItem.current = undefined;
        },
        onDragMove(e){
            const {startPos} = dragItem.current
            // 用户拖拽一定距离后才触发
            if(Math.abs(e.pageX-startPos.x)<5&&Math.abs(e.pageY-startPos.y)<5&&status.current!=="dragging"){
                dragItem.current.config.nowEmpty = true;
                status.current = ('dragging');
                dragItem.current.dom.style.pointerEvents='none';
                document.body.appendChild(dragItem.current.dom);
                dragItem.current.dom.classList.add("form-item-ondrag");
                document.body.style.cursor = 'move';
                context.render()
            }
            if(status.current==="dragging"){
                dragItem.current.dom.style.left = e.pageX+'px';
                dragItem.current.dom.style.top = e.pageY+'px';
            }
        },
        addItemByUuid(item,itemData,uuid){
            if(uuid===undefined){
                item.children.push(itemData)
            }else{
                let beforeIndex;
                item.children.find((item,index)=>{
                    if(item.uuid===uuid){
                        beforeIndex = index;
                        return true;
                    }
                });
                item.children.splice(beforeIndex,0,itemData);
                
            }
        },
        getClosestItem(x, y) {
            const allDom = dom.current.querySelectorAll("[data-uuid]");
            let min = Infinity;
            let uuid;
            let pos;
            for(let i = 0 ;i<allDom.length;i++){
                const item = allDom[i];
                let id = item.getAttribute("data-uuid");
                let rect = itemRectCache[id]||item.getBoundingClientRect();
                let left = rect.left-x;let right = rect.right-x;
                let top = rect.top-y;let bottom = rect.bottom-y;
                if(left<0&&right>0&&top<0&&bottom>0){//在元素内部
                    if(item.children.length&&item.className.indexOf('free-form-container')>-1){//容器，且有子元素就跳过，通过子元素来判定
                        continue;
                    }
                    uuid = id;
                    pos = {
                        left,right,top,bottom
                    }
                    return {
                        uuid,
                        pos
                    }
                }
                
                let dx = Math.abs(left)<Math.abs(right)?left:right;
                let dy = Math.abs(top)<Math.abs(bottom)?top:bottom;
                let multiplyVal =Math.abs(dx)*Math.abs(dy)
                if(multiplyVal<min){
                    min = multiplyVal;
                    uuid = id;
                    pos = {
                        left,right,top,bottom
                    }
                }
            }
            return {
                uuid,
                pos
            };
        }
    })

    useEffect(()=>{
        context.center = _this.current;
        document.addEventListener("keyup",onKeyPress);
        document.addEventListener("mousemove",onFindCursor)
        return ()=>{
            document.removeEventListener("keyup",onKeyPress);
            document.removeEventListener("mousemove",onFindCursor)
        }
    },[]); 
    
    const onFindCursor = (e)=>{
        const {pageX,pageY,offsetX,offsetY} = e;
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(()=>{
            // 画布内在移动
            if(status.current==='dragging'&&e.path.indexOf(dom.current)>-1){
                const item = context.center.getClosestItem(pageX,pageY);
                console.log(item)
            }
        },100)
        
    }
    
    
    const onKeyPress = (e)=>{
        if(e.target.tagName==="INPUT")return;
        if(activeItem.current&&e.code==="Backspace"&&!activeItem.current.isRoot){
            context.removeItem(activeItem.current);
            onCancel();
        }
    }

    const onMouseUp = (event,item,uuid)=>{
        // 不论什么情况先解除事件绑定
        removeEvent();
        if(status.current ==='ended')return;
        event.stopPropagation();
        if(!dragItem.current){
            // 新增时的逻辑
            context.left.onMouseUp(event,true);
            const {nowItem }= context.left;
            if(!item.children)item.children = [];
            const itemData =  {
                type:nowItem.type,
                uuid:uuid1(),
                label:"测试",
                ...nowItem.defaultProps
            };
            // 没有索引就默认添加到后面
            context.center.addItemByUuid(item,itemData,uuid)
        }else{
            context.center.onMoveDrop(event,item,uuid);
        }
        status.current = ("ended");
        setState(new Date())
    }

    const onClick = (event,item)=>{
        if(activeItem.current){
            activeItem.current.active = false
        }
        activeItem.current = item;
        item.active = true;
        props.context.render();
        props.context.right.onSelect(item)
    }

    const onCancel = ()=>{
        if(!activeItem.current)return;
        activeItem.current.active = false;
        activeItem.current = undefined;
        context.render();
        props.context.right.onSelect(undefined)
    }

    const onDrag = (event,config)=>{
        const dom = document.querySelector(`.item-${config.uuid}`)
        dragItem.current = {
            config,
            dom,
            startPos:{
                x:event.pageX,
                y:event.pageY
            },
            parent:dom.parentElement
        };
        addEvent();
    }

    const addEvent = () => {
		document.addEventListener('mouseup', _this.current.onMoveDrop);
		document.addEventListener('mousemove', _this.current.onDragMove);
    };
    
    const removeEvent = () => {
		document.removeEventListener('mouseup', _this.current.onMoveDrop);
		document.removeEventListener('mousemove', _this.current.onDragMove);
	};

    return (
        <div className="editor-center">
            <div onClick={onCancel} ref={ref=>{dom.current=ref}} className={"content-canvas "+status.current} onMouseMove={undefined}>
                <EventContext.Provider value={{
                    onMouseUp,
                    onDrag,
                    onClick
                }}>
                    <Parser  config={data} {...data.formProps} />
                </EventContext.Provider>
                <div className="cursor-horizontal"></div>
                <div className="cursor-vertical"></div>
            </div>  
            
        </div>
    );
};
