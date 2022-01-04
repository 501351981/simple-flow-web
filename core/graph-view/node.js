import $ from 'jquery'

export  function nodeMixin(GraphView) {
    GraphView.prototype.registerNode = function (type,config) {
        this._nodeTypes[type] = config
    }

    GraphView.prototype.getNodeConfig = function (type) {
        return this._nodeTypes[type]
    }

    GraphView.prototype.getDataModel = function () {
        return this._dataModel
    }

    GraphView.prototype.dm = function () {
        return this.getDataModel()
    }
}

