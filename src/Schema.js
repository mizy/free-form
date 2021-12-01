const schema = {
    type: "div",
    id: 'main',
    style: {
        height: '100%'
    },
    children: [{
        type: "div",
        id: 'topbar',
        style: {
            height: 30,
            borderBottom: '1px solid #cfcfcf'
        },
        children: [{
            type: 'span',
            id: 'title',
            children: "free-editor"
        }]
    }, {
        type: 'div',
        id: 'center',
        style: {
            display: 'flex',
            height: `calc(100vh - 30px)`,
        },
        children: [
            {
                type: 'div',
                id: 'c-left',
                style: {
                    width: '150px',
                    borderRight: '1px solid #cfcfcf'
                },
                children: [{
                    type: 'ItemList',
                    id: 'ItemList',
                    data: [{
                        name: "拖拽1",
                        type: "drag"
                    }]
                }]
            }, {
                type: 'div',
                id: 'c-center',
                style: {
                    flex: '1',
                }
            }, {
                type: 'div',
                id: 'c-right',
                style: {
                    width: '150px',
                    borderLeft: '1px solid #cfcfcf'
                }
            }
        ]
    }],
}

export default schema;