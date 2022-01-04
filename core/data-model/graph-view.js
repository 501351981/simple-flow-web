export function graphViewMixin(DataModel) {
    DataModel.prototype.setGraphView = function(graphView){
        this._graphView = graphView
    }
    DataModel.prototype.getNodeConfig = function (type) {
        return this._graphView.getNodeConfig(type)
    }
}