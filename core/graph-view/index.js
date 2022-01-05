import merge from 'lodash/merge'
import {nodeMixin} from "./node";
import {eventMixin} from './event'
import {viewMixin} from './view'
import {selectionModelMixin} from "./selection-model";
import {shortcutMixin} from './shortcut'
import config from '../config/index'

function GraphView(dataModel, options = {}) {
    this._dataModel = dataModel
    this._config = merge({},config,options)
    this._parentNode = null      //父节点
    this._outerLayer = null      //最外层节点
    this._eventLayer = null      //事件层
    this._backgroundLayer = null //背景层
    this._gridLayer = null       //网格层
    this._linkLayer = null       //连线层
    this._nodeLayer = null       //节点层

    this._width = this._config.graphView.width
    this._height = this._config.graphView.height
    this._background = this._config.graphView.background
    this._gridSize = this._config.grid.gridSize
    this._scale = 1

    this._nodeTypes = {}

    this._selectionModel = null

    this._offsetX = 0   // 鼠标在图纸上的位置 X
    this._offsetY = 0   // 鼠标在图纸上的位置 Y

    this._version = '1.0.0'
    this.initView()
    this.initEvent()
    this.initSelectionModel()
    this.initShortcut()
    dataModel.setGraphView(this)
    console.log('config',this._config)
}

nodeMixin(GraphView)
eventMixin(GraphView)
viewMixin(GraphView)
selectionModelMixin(GraphView)
shortcutMixin(GraphView)

GraphView.prototype.getVersion = function () {
    return this._version
}
export default GraphView