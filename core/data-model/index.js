import {graphViewMixin} from './graph-view'
import {attrMixin} from "./attr"
import {nodeMixin} from './node'
import {historyManagerMixin} from "./history-manager"
import {hookMixin} from "./hook"
import {hierarchyMixin} from "./hierarchy";

function DataModel() {
    this._graphView = null
    this._attrObj = {}
    this._nodes = {}             //node缓存，key为id，值为node对象
    this._nodesSortKey = []      //存储node的id，序列化按照这个循序来进行
    this._wires = {}             //wire缓存，key为id，值为wire对象
    this._wiresBySourceId = {}   //sourceId为key，值为其后被链接的节点集合
    this._wiresByTargetId = {}   //targetId为key，值为链接target节点的节点集合
    this._historyManager = null
    this._dataModelChangeListener = []
    this._dataPropertyChangeListener = []

}

graphViewMixin(DataModel)
attrMixin(DataModel)
nodeMixin(DataModel)
historyManagerMixin(DataModel)
hookMixin(DataModel)
hierarchyMixin(DataModel)

DataModel.prototype.getEditable = function (){
    if(this._graphView){
        return this._graphView.getEditable()
    }else {
        return true
    }

}
export default DataModel
