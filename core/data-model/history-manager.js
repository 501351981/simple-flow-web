export function historyManagerMixin(DataModel) {
    DataModel.prototype.setHistoryManager = function(historyManager){
        this._historyManager = historyManager
        return this
    }
    DataModel.prototype.getHistoryManager = function () {
        return this._historyManager
    }
}