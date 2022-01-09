export  function hookMixin(DataModel) {
    DataModel.prototype.addDataModelChangeListener = function (listener,ahead) {
        if(ahead){
            this._dataModelChangeListener.unshift(listener)
        }else{
            this._dataModelChangeListener.push(listener)
        }
    }

    DataModel.prototype.removeDataModelChangeListener = function (listener) {
        if(!listener){
            this._dataModelChangeListener = []
            return this
        }
        for (let i = 0; i < this._dataModelChangeListener.length; i++){
            if(this._dataModelChangeListener[i] === listener){
                this._dataModelChangeListener.splice(i,1)
                return this
            }
        }
        return this
    }

    DataModel.prototype._fireDataModelChangeListener = function (event) {
        this._dataModelChangeListener.forEach(listener => listener(event) )
    }

    DataModel.prototype.addDataPropertyChangeListener = function (listener,ahead) {
        if(ahead){
            this._dataPropertyChangeListener.unshift(listener)
        }else{
            this._dataPropertyChangeListener.push(listener)
        }
    }


    DataModel.prototype.removeDataPropertyChangeListener = function (listener) {
        if(!listener){
            this._dataPropertyChangeListener = []
            return this
        }
        for (let i = 0; i < this._dataPropertyChangeListener.length; i++){
            if(this._dataPropertyChangeListener[i] === listener){
                this._dataPropertyChangeListener.splice(i,1)
                return this
            }
        }
        return this
    }

    DataModel.prototype._fireDataPropertyChangeListener = function (event) {
        this._dataPropertyChangeListener.forEach(listener => listener(event) )
    }


}