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
            const data = context.data;
            let res;
            let min = Infinity;
            // 递归查找最近的元素，在内部则跳出
            function bfs(items){
                for(let i = 0;i<items.length;i++){
                    const item = items[i];
                    const {uuid} = item;
                    const ref = dom.current.querySelector(`[data-uuid="${uuid}"]`);
                    const rect = ref.getBoundingClientRect();
                    const isInside = x>rect.left&&x<rect.right&&y>rect.top&&y<rect.bottom;
                    if(isInside){
                        min = Infinity;// 重置最小值，从子级选最小的
                        if(item.type!=='container'){// 不是容器且在内部之间返回
                            res = {
                                parent:context.getParent(item),
                                item,
                                ref,
                                rect
                            };
                            return;
                        }
                        if(item.children&&item.children.length>0){
                            bfs(item.children);// 遍历容器内的元素
                        }else{// 在容器内部的情况
                            res = { 
                                item,
                                ref,
                                rect
                            };
                        };
                        return ;// 一旦在内部则跳出循环
                    }else{
                         const dx = Math.min(Math.abs(rect.left-x),Math.abs(rect.right-x));
                         const dy = Math.min(Math.abs(rect.top-y),Math.abs(rect.bottom-y));
                         const val = dx*dy;
                         if(val<min){
                            min = val;
                            const parent = context.getParent(item)
                            res = {
                                parent,
                                item,ref,rect
                            }
                         }
                    }
                }
            }
            bfs([data]);
            return res;
        },
         // 拖拽时生成辅助游标
        onFindCursor(e){
            const {clientX,clientY,offsetX,offsetY} = e;
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(()=>{
                // 画布内在移动
                if(status.current==='dragging'&&e.path.indexOf(dom.current)>-1){
                    const res = context.center.getClosestItem(clientX,clientY);
                    const parent = res.parent;
                    const isRow = (parent||res.item).direction === 'row';
                    const {left,top,right,bottom,width,height} = res.rect;
                    if(!parent){// 直接生成在容器中,浮标不可见
                        setCursor({
                            left:-9999,
                            top:-9999
                        })
                        _this.current.nowItem = {
                            parent:res.item,
                            index:0
                        }
                        return;
                    }

                    if(isRow){//横向
                        const isLeft = clientX<(left+width/2);
                        setCursor({
                            width:2,height:height,
                            left:isLeft?left:right,
                            top
                        })
                        _this.current.nowItem = {
                            parent,
                            index:parent.children.indexOf(res.item)+isLeft?0:1
                        }
                    }else{//纵向
                        const isTop = clientY<(top+height/2);
                        setCursor({
                            width:width,height:2,
                            left:left,
                            top:isTop?top:bottom
                        })
                        _this.current.nowItem = {
                            parent,
                            index:parent.children.indexOf(res.item)+isTop?0:1
                        }
                    }
                }
            },30)
        },
        onKeyPress(e){
            if(e.target.tagName==="INPUT")return;
            if(activeItem.current&&e.code==="Backspace"&&!activeItem.current.isRoot){
                context.removeItem(activeItem.current);
                this.onCancel();
            }
        },
        onCancel(){
            if(!activeItem.current)return;
            activeItem.current.active = false;
            activeItem.current = undefined;
            context.render();
            context.right.onSelect(undefined)
        }
        
    })

    useEffect(()=>{
        context.center = _this.current;
        document.addEventListener("keyup",context.center.onKeyPress);
        document.addEventListener("mousemove",context.center.onFindCursor)
        return ()=>{
            document.removeEventListener("keyup",context.center.onKeyPress);
            document.removeEventListener("mousemove",context.center.onFindCursor)
        }
    },[]); 
    
   
    
   

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
            // context.center.onMoveDrop(event,item,uuid);
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
            <div onClick={_this.current.onCancel} ref={ref=>{dom.current=ref}} className={"content-canvas "+status.current} onMouseMove={undefined}>
                <EventContext.Provider value={{
                    onMouseUp,
                    onDrag,
                    onClick
                }}>
                    <Parser  config={data} {...data.formProps} />
                </EventContext.Provider>
                <div className="cursor" style={{...cursor}}></div>
            </div>  
            
        </div>
    );
};
