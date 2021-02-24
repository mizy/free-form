import Render from '../Render'

const Container = ({children=[],userComponents,direction='row',labelCol,wrapperCol})=>{
    return <div className="free-form-container" style={{flexDirection:direction}}>
        {children.map((item,index)=>{
            if(labelCol){
                item.labelCol=labelCol;
            }
            if(wrapperCol){
                item.wrapperCol = wrapperCol;
            }
            return (
                <Render userComponents={userComponents} key={`${item.name}`} config={item} />
            );
        })}
    </div>
}
export default Container;