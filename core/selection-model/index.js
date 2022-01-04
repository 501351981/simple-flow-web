import Node from "../node/index";
import Wires from '../wires/index'

function SelectionModel(dataModel,graphView) {
    this._list = []
    this._selectionChangeListeners = []
    this._dataModel = dataModel
    this._graphView = graphView
    this._filterFunc = null
}

//增加监听器，监听选中变化事件
//dataModel.addSelectionChangeListener(function(event) {
//      //event格式：
//      {
//      	kind: "set",//事件类型set|remove|append|clear
//      	datas: datas,//包含所有选中状态变化的数据元素，之前选中现在取消选中，和之前没选中现在被选中的数据元素
//      }
// });
SelectionModel.prototype.addSelectionChangeListener = function (listener, ahead) {
    if(ahead){
        this._selectionChangeListeners.unshift(listener)
    }else{
        this._selectionChangeListeners.push(listener)
    }
}

//追加选中一个或多个数据元素，参数可为单个数据元素，也可为数组
SelectionModel.prototype.appendSelection = function (datas) {
   if(Array.isArray(datas)){
       for( let i = 0; i < datas.length; i++) {
           let data = datas[i]
           if(this._filterFunc && !this._filterFunc(data) || this.contains(data)){
               break
           }
           this._list.push(data)
           data.selected()
       }
   }else{
       if(this._filterFunc && !this._filterFunc(datas) || this.contains(datas)){
           return
       }
       this._list.push(datas)
       datas.selected()
   }
    return this
}

//取消所有选中数据元素
SelectionModel.prototype.clearSelection = function () {
    this._list.forEach(data => {
        data.deselected()
    })
    this._list = []
    return this
}

//判断data对象是否被选中
SelectionModel.prototype.contains = function (data) {
    for(let i = 0; i < this._list.length; i++){
        if(this._list[i] === data){
            return true
        }
    }
    return false
}

//提供一个回调函数遍历此选中模型
SelectionModel.prototype.each = function (func) {
    this._list.forEach((item, index) => {
        func(item, index)
    })
    return this
}

SelectionModel.prototype.eachNode = function(func){
    let nodes = this._list.filter(item => item instanceof Node)
    nodes.forEach((item, index) => {
        func(item, index)
    })
    return this
}

SelectionModel.prototype.getDataModel = function () {
    return this._dataModel
}

//返回选中过滤器函数
// 有些数据元素不希望被用户选中，可以通过设置此过滤器实现
SelectionModel.prototype.getFilterFunc = function () {
    return this._filterFunc
}

//返回首个被选中的数据元素，如果没有选中数据元素则返回空
SelectionModel.prototype.getFirstData = function () {
    return this._list[0]
}

//返回最后被选中的数据元素，如果没有选中数据元素则返回空
SelectionModel.prototype.getLastData = function () {
    let length = this._list.length
    if(length){
        return this._list[length - 1]
    }
    return
}

// 获取所有被选中数据元素集合，注意不可直接对返回的集合进行增删操作，
// 如果需要增删操作，应使用toSelection方法
SelectionModel.prototype.getSelection = function () {
    return this._list
}

// 判断是否有选中的数据元素
SelectionModel.prototype.isEmpty = function () {
    return !this._list.length
}

// 判断数据元素是否可被选中
SelectionModel.prototype.isSelectable = function (node) {

}

// 取消选中数据元素，参数可为单个数据元素，也可为数组
SelectionModel.prototype.removeSelection = function (datas) {
    if(Array.isArray(datas)){
        for(let i = 0; i < datas.length; i++){
            let data = datas[i]
            for(let j = 0; j < this._list.length; j++){
                if(this._list[j] === data){
                    data.deselected()
                    this._list.splice(j,1)
                    break
                }
            }
        }
    }else{
        for(let j = 0; j < this._list.length; j++){
            if(this._list[j] === datas){
                datas.deselected()
                this._list.splice(j,1)
                break
            }
        }
    }
    return this
}

// 删除监听选中变化事件的监听器
SelectionModel.prototype.removeSelectionChangeListener = function (listener) {
    for(let i = 0; i < this._selectionChangeListeners.length; i++){
        if(listener === this._selectionChangeListeners[i]){
            this._selectionChangeListeners.splice(i,1)
            return this
        }
    }
    return this
}

// 选中DataModel中的所有数据元素
SelectionModel.prototype.selectAll = function () {
    this.selectAllNode()
    this.selectAllWires()
    return this
}

SelectionModel.prototype.selectAllNode = function () {
    this._dataModel.eachNode( (node) => {
        this.appendSelection(node)
    })
    return this
}

SelectionModel.prototype.selectAllWires = function () {
    this._dataModel.eachWires( (wires) => {
        this.appendSelection(wires)
    })
    return this
}

// 设置选中过滤器函数
// 有些数据元素不希望被用户选中，可以通过设置此过滤器实现
SelectionModel.prototype.setFilterFunc = function (func) {
    this._filterFunc = func
    return this
}

// 设置选中数据元素，参数可为单个数据元素，也可为数组
SelectionModel.prototype.setSelection = function (datas) {
    this._list = []
    if(Array.isArray(datas)){
        for( let i = 0; i < datas.length; i++) {
            let data = datas[i]
            if(this._filterFunc && !this._filterFunc(data)){
                break
            }
            this._list.push(data)
            data.selected()
        }
    }else{
        if(this._filterFunc && !this._filterFunc(datas)){
            return
        }
        this._list.push(datas)
        datas.selected()
    }
    return this
}

// 获取选中模型中数据元素的个数
SelectionModel.prototype.size = function () {
    return this._list.length
}

// 获取所有被选中数据元素集合(新数组)
SelectionModel.prototype.toSelection = function () {
    return [...this._list]
}

export default SelectionModel