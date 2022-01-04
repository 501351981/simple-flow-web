export  function attrMixin(DataModel) {
    DataModel.prototype.getAttr = function (name) {
        return this._attrObj[name]
    }


    DataModel.prototype.getAttrObject = function(){
        return this._attrObj
    }

    DataModel.prototype.setAttr = function (name,value) {
        let historyEvent = {
            kind: 'dataModelProperty',
            property: `a:${name}`,
            oldValue: this.getAttr(name),
            newValue: value
        }
        this._attrObj[name] = value
        this._historyManager &&  this._historyManager.addHistory(historyEvent)
        return this
    }


    DataModel.prototype.a = function () {
        if(arguments.length===1){
            if(typeof arguments[0] === 'string'){
                return this.getAttr(arguments[0])
            }else if(typeof arguments[0] === 'object'){
                let historyEvents = []
                for(let key in arguments[0]){
                    historyEvents.push({
                        kind: 'dataModelProperty',
                        property: `a:${key}`,
                        oldValue: this.getAttr(key),
                        newValue:  arguments[0][key]
                    })
                    this._attrObj[key] = arguments[0][key]
                }
                this._historyManager &&  this._historyManager.addHistory(historyEvents)
                return this
            }

        }
        if(arguments.length===2){
            this.setAttr(arguments[0], arguments[1])
            return this
        }
    }
}