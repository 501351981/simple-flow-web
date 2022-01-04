import {graphViewMixin} from './graph-view'
import {attrMixin} from "./attr";
import {nodeMixin} from './node'
import {historyManagerMixin} from "./history-manager";

function DataModel() {
    this._graphView = null
    this._attrObj = {}
    this._nodes = {}
    this._wires = {}
    this._wiresBySourceId = {}
    this._wiresByTargetId = {}
    this._historyManager = null
}

graphViewMixin(DataModel)
attrMixin(DataModel)
nodeMixin(DataModel)
historyManagerMixin(DataModel)

export default DataModel