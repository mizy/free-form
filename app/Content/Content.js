import { useEffect,useRef, useState, Fragment } from "react";
import { Input, Select, message, Modal } from "antd";
import {v1 as uuid1} from 'uuid';
import Parser from './Parser';
import {EventContext} from './context';
import {observer} from 'mobx-react';
import {observable,action} from 'mobx';
import Cursor from './Cursor';
let itemRectCache = new WeakMap();
let cursorTimeout;
const status = observable({
    current:'ended'
})
const cursor = observable({});

const setCursor = action((data)=>{
    for(let key in data){
        cursor[key] = data[key]
    }
})
export default observer(props => {
    const { data,context } = props;
    const dom = useRef();
    const activeItem = useRef();
    const dragItem = useRef();
    const dragRef = useRef();

    const _this = useRef({

        getRect(uuid){
            if(itemRectCache[uuid]){
                return itemRectCache[uuid]
            }else{
                const ref = dom.current.querySelector(`[data-uuid="${uuid}"]`);
                if(!ref)return false;
                const rect = ref.getBoundingClientRect();
                itemRectCache[uuid] = rect;
                return rect;
            }
        },
        onDragStart:()=>{
            status.current = ("dragging");
        },
        onDragEnd:()=>{
            status.current = ("ended");
        },
        
        getClosestItem(x, y) {
            const data = context.data;
            let res;
            let min = Infinity;
            // 递归查找最近的元素，在内部则跳出
            function bfs(items,parent){
                for(let i = 0;i<items.length;i++){
                    const item = items[i];
                    const {uuid} = item;
                    const rect = _this.current.getRect(uuid);
                    if(!rect){
                        continue
                    }
                    const isInside = x>rect.left&&x<rect.right&&y>rect.top&&y<rect.bottom;
                    if(isInside){
                        min = Infinity;// 重置最小值，从子级选最小的
                        if(item.type!=='container'){// 不是容器且在内部之间返回
                            res = {
                                parent,
                                item,
                                rect
                            };
                            return;
                        }
                        if(item.children&&item.children.length>0){
                            bfs(item.children,item);// 遍历容器内的元素
                        }else{// 在容器内部的情况
                            res = { 
                                item,
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
                            res = {
                                parent,
                                item,rect
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
            // 画布内在移动
            if(status.current==='dragging'&&e.path.indexOf(dom.current)>-1){
                const res = context.center.getClosestItem(clientX,clientY);
                if(!res)return setCursor({
                    left:-9999,
                    top:-9999
                });
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
                const itemIndex = parent.children.indexOf(res.item);
                let index;
                if(isRow){//横向
                    const isLeft = clientX<(left+width/2);
                    index = itemIndex+(isLeft?0:1);
                    if(isLeft||index>parent.children.length-1){//不是第一个的情况
                        setCursor({
                            width:2,height:height,
                            left:isLeft?left:right,
                            top
                        });
                    }else{
                        const rect = _this.current.getRect(parent.children[index].uuid);
                        setCursor({
                            width:2,height:rect.height,
                            left:rect.left,
                            top
                        });
                    }
                    _this.current.nowItem = {
                        parent,
                        index
                    }
                }else{//纵向
                    const isTop = clientY<(top+height/2);
                    index = itemIndex+(isTop?0:1);
                    if(isTop||index>parent.children.length-1){//不是第一个的情况
                        setCursor({
                            width:width,height:2,
                            left:left,
                            top:isTop?top:bottom
                        })
                    }else{
                        const rect = _this.current.getRect(parent.children[index].uuid);
                        setCursor({
                            width:rect.width,height:2,
                            left:rect.left,
                            top:rect.top
                        })

                    }
                    
                    _this.current.nowItem = {
                        parent,
                        index
                    }
                }
            }
        },
        onKeyPress(e){
            if(e.target.tagName==="INPUT")return;
            if(activeItem.current&&e.code==="Backspace"&&!activeItem.current.isRoot){
                context.removeItem(activeItem.current);
                _this.current.onCancel();
            }
        },
        onCancel(){
            if(!activeItem.current)return;
            activeItem.current.active = false;
            activeItem.current = undefined;
            context.right.onSelect(undefined)
        },
        onMouseUp:action((event)=>{

            // 不论什么情况先解除事件绑定
            _this.current.removeEvent();
            if(status.current ==='ended')return;
            event.stopPropagation();
            event.preventDefault();
            itemRectCache = new WeakMap();
            const {parent,index} = _this.current.nowItem; 
            if(!dragItem.current){
                // 新增时的逻辑
                context.left.onMouseUp(event,true);
                const {nowItem }= context.left;
                const itemData =  {
                    type:nowItem.type,
                    uuid:uuid1(),
                    formItemProps:{
                        label:"测试",
                    },
                    children:nowItem.type==='container'?[]:undefined,
                    ...nowItem.defaultProps
                };
                parent.children.splice(index,0,itemData);
            }else{
                const {config }= dragItem.current; 
                context.removeItem(config)
                parent.children.splice(index,0,config);
                dragItem.current = undefined;
                dragRef.current.style.display='none';
                config.dragging = false;
            }
            status.current = ("ended");
        }),
        onClick:action((event,item)=>{
            if(activeItem.current){
                activeItem.current.active = false
            }
            activeItem.current = item;
            item.active = true;
            props.context.right.onSelect(item)
        }),
        onDrag(event,config){
            const dom = document.querySelector(`.item-${config.uuid}`);
            dragRef.current.innerHTML = dom.innerHTML;
            dragItem.current = {
                config,
                startPos:{
                    x:event.pageX,
                    y:event.pageY
                }
            };
            _this.current.addEvent();
        },

        onDragMove:action((e)=>{
            const {startPos,config} = dragItem.current
            // 用户拖拽一定距离后才触发
            if(Math.abs(e.pageX-startPos.x)<5&&Math.abs(e.pageY-startPos.y)<5&&status.current!=="dragging"){
                status.current = ('dragging');
                config.dragging = true;
                dragRef.current.style.display='block'
            }
            if(status.current==="dragging"){
                dragRef.current.style.left = e.pageX+'px';
                dragRef.current.style.top = e.pageY+'px';
            }
        }), 
        addEvent(){
            document.addEventListener('mouseup', _this.current.onMouseUp);
            document.addEventListener('mousemove', _this.current.onDragMove);
        },
        removeEvent(){
            document.removeEventListener('mouseup', _this.current.onMouseUp);
            document.removeEventListener('mousemove', _this.current.onDragMove);
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
    
    return (
        <div className="editor-center">
            <div onClick={_this.current.onCancel} ref={ref=>{dom.current=ref}}
                onMouseUp={_this.current.onMouseUp}
                className={"content-canvas "+status.current} >
                <EventContext.Provider value={{
                    onDrag:_this.current.onDrag,
                    onClick:_this.current.onClick
                }}>
                    <Parser config={data} {...data.formProps} />
                </EventContext.Provider>
                <Cursor status={status} style={{...cursor}} />
                <div className="drag-move-show" ref={ref=>dragRef.current = ref} ></div>
            </div>  
            
        </div>
    );
});
