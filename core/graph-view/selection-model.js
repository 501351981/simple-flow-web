import SelectionModel from "../selection-model/index";

export function selectionModelMixin(GraphView) {
    GraphView.prototype.initSelectionModel = function () {
        this._selectionModel = new SelectionModel(this._dataModel,this)
    }

    GraphView.prototype.getSelectionModel = function () {
        return this._selectionModel
    }

    GraphView.prototype.sm = function () {
        return this.getSelectionModel()
    }
}