export  function hookMixin(GraphView) {
    GraphView.prototype.beforeDelete = function (datas, callback) {
        typeof callback === 'function' && callback(datas)
    }
}