import Render from '../Render'

const Container = ({children=[],userComponents,direction='row',labelCol,wrapperCol})=>{
    return <div className="free-form-container" style={{flexDirection:direction}}>
        {children.map((item,index)=>{
            return (
                <Render userComponents={userComponents} labelCol={labelCol} wrapperCol={wrapperCol} key={`${item.uuid||item.formItemProps.name}`} config={item} />
            );
        })}
    </div>
}
export default Container;