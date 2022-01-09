import {graphViewMixin} from './graph-view'
import {attrMixin} from "./attr"
import {nodeMixin} from './node'
import {historyManagerMixin} from "./history-manager"
import {hookMixin} from "./hook"

function DataModel() {
    this._graphView = null
    this._attrObj = {}
    this._nodes = {}
    this._wires = {}
    this._wiresBySourceId = {}
    this._wiresByTargetId = {}
    this._historyManager = null
    this._dataModelChangeListener = []
    this._dataPropertyChangeListener = []

}

graphViewMixin(DataModel)
attrMixin(DataModel)
nodeMixin(DataModel)
historyManagerMixin(DataModel)
hookMixin(DataModel)

export default DataModel