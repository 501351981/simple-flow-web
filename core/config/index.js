export default {
    graphView: {
        width: 5000,
        height: 5000,
        background: '#fff',
        scale:{
            max: 2,
            min: 0.5,
            step: 0.1
        }
    },
    grid: {
        show: true,
        gridSize: 20,
        stroke: '#eee',
        strokeWidth: 1,
    },
    groupSelect:{
        intersects: false, //true：相交框选，false：包含框选
        selectable: true, // 是否只返回可被选中的图元
    }
}