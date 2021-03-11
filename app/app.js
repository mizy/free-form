import { useEffect, useState, useRef,Fragment } from "react";
import { Input, Select, message, Modal } from "antd";
import './index.less'
import Top from './Top/Top';
import Left from './Left/Left';
import Right from './Right/Right';
import Content from './Content/Content';
import Components from './Content/Components/componentsMap';
import {v1 as uuid} from 'uuid';
import {observable,autorun} from 'mobx';

export default props => {
    const data = useRef(observable({
        type:"container",
        uuid:'root',
        isRoot:true,
        labelCol:{span:8},
        wrapperCol:{span:8},
        props:{},
        children:[]
    }));
    window.dataRef = data.current;
   
    const [renderFlag,setRenderFlag] =useState();
    const _this = useRef({
        render:()=>{
            setRenderFlag(new Date());
        },
        setData(res){
            function dfs(){
                if(!res.uuid){
                    res.uuid = uuid();
                }
                if(res.children){
                    res.children.forEach(item=>dfs(item))
                }
            }
            dfs(res);
            data.current = res;
            this.render();
        },
        data:data.current,
        removeItem(item){
            const parent = this.getParent(item);
            if(!parent)return;
            const index = parent.children.indexOf(item);
            parent.children.splice(index,1);
        },
        getItemByUuid(uuid){
            let res;
            function dfs(item){
                if(item.uuid===uuid){
                    res = item;
                    return
                };
                if(item.children){
                    item.children.forEach(subItem=>{
                        dfs(subItem);
                    })
                }
            }
            dfs(data.current);
            return res;
        },
        getParent:(child)=>{
            let res;
            function dfs(item,parent){
                if(item===child){
                    res = parent;
                    return
                };
                if(item.children){
                    item.children.forEach(subItem=>{
                        dfs(subItem,item);
                    })
                }
            }
            dfs(data.current);
            return res;
        }, 
    });

    return (
        <div className="editor-page">
            <Top context={_this.current} />
            <div className="editor-wrapper">
                <Left context={_this.current} />
                <Content context={_this.current} data={data.current} />
                <Right context={_this.current} />
            </div>
        </div>
    );
};

