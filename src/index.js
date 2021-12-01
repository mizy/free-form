import { useState, useEffect } from 'react';
import Renderer from './Renderer/Renderer';
import schema from './Schema'

const Editor = () => {

    return <div className="free-editor">
        <Renderer schema={schema} />
    </div>
};
export default Editor;