import { useEffect, useState, Fragment, useMemo } from 'react';
import components from '../Content/Components/componentsMap';
import { Form } from 'antd';
export default (props) => {
	const [pos, setPos] = useState({
		x: -999,
		y: -999,
	});
	const [nowType, setNowType] = useState();
	useEffect(() => {
		props.context.left = {
            onMouseDown : (item, type) => {
                props.context.center.onDragStart();
                setNowType(type);
                props.context.left.nowItem = components[type]
                props.context.left.nowItem.type=type;
                props.context.left.addEvent();
            },
        
            addEvent : () => {
                document.addEventListener('mouseup', props.context.left.onMouseUp);
                document.addEventListener('mousemove', props.context.left.onMouseMove);
            },
        
            onMouseUp :(event,silent) => {
                if(!silent)props.context.center.onDragEnd();
                document.body.style.cursor = 'auto';
                setNowType();
                document.removeEventListener('mouseup', props.context.left.onMouseUp);
                document.removeEventListener('mousemove', props.context.left.onMouseMove);
            },
        
            onMouseMove: (e) => {
                document.body.style.cursor = 'move';
                setPos({
                    x: e.pageX,
                    y: e.pageY,
                });
            }
        };
	}, []);

	

	const componentList = useMemo(() => {
		let list = [];
		for (let x in components) {
			const item = components[x];
			list.push(
				<div key={x} onMouseDown={() => props.context.left.onMouseDown(item, x)} className="component-item">
					{item.title}
				</div>
			);
		}
		return list;
	}, [components]);

	const Component = components[nowType];
	return (
		<div className="editor-left">
			<div className="components-title">组件列表</div>
			<div className="components-list">{componentList}</div>
			<div style={{ left: pos.x-16, top: pos.y-16, display: Component ? 'block' : 'none' }} className="component-show">
				{Component ? (
					<span>{Component.title}</span>
				) : (
					false
				)}
			</div>
		</div>
	);
};
