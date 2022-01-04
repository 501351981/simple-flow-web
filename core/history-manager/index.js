
function HistoryManager(dataModel) {
    this._dataModel = dataModel
    this._betweenTransaction = false
    this._histories = []
    this._historyIndex = -1
    this._transactionHistories = []
    this._disabled = false
    this._maxHistoryCount = 200
    this.ignoreDataModelPropertyMap = {}
    this.ignoredPropertyMap = {}

    dataModel.setHistoryManager(this)
}

HistoryManager.prototype._filterEvent = function (event) {
    if(Array.isArray(event)){
        event = event.filter(e => {
            if(e.kind === 'property' && this.ignoredPropertyMap[e.property] || e.kind === 'dataModelProperty' && this.ignoreDataModelPropertyMap[e.property]){
                return false
            }
            return true
        })
        if(event.length === 0){
            event = null
        }
    }else{
        if(event.kind === 'property' && this.ignoredPropertyMap[event.property] || event.kind === 'dataModelProperty' && this.ignoreDataModelPropertyMap[event.property]){
            event = null
        }
    }
    return event
}
HistoryManager.prototype.addHistory = function (event) {
    if(this.isDisabled()){
        return this
    }
    event = this._filterEvent(event)
    if(!event){
        return
    }

    if(this.isBetweenTransaction()){
        this._transactionHistories.push(event)
        return this
    }

    if(this._historyIndex === -1){
        this._histories = [event]
        this._historyIndex++
    }else{
        this._histories = this._histories.slice(0, this._historyIndex + 1)
        if(this._histories.length >= this._maxHistoryCount){
            this._histories.shift()
            this._histories.push(event)
        }else{
            this._histories.push(event)
            this._historyIndex++
        }

    }
    return this
}

HistoryManager.prototype.afterRedo = function () {
    //由用户重载
}

HistoryManager.prototype.afterUndo = function () {
    //由用户重载
}

HistoryManager.prototype.beginTransaction = function () {
    this._betweenTransaction = true
    return this
}

HistoryManager.prototype.endTransaction = function () {
    this._betweenTransaction = false
    if(!this._transactionHistories.length){
        return this
    }

    if(this._historyIndex === -1){
        this._historyIndex = 0
        this._histories = [[...this._transactionHistories]]
    }else{
        this._histories = this._histories.slice(0,this._historyIndex + 1)
        if(this._histories.length >= this._maxHistoryCount){
            this._histories.shift()
            this._histories.push( [...this._transactionHistories])
        }else{
            this._histories.push( [...this._transactionHistories])
            this._historyIndex++
        }
    }
    this._transactionHistories = []
    return this
}

HistoryManager.prototype.isBetweenTransaction = function () {
    return this._betweenTransaction
}

HistoryManager.prototype.canRedo = function () {
    return this._historyIndex < this._histories.length - 1
}

HistoryManager.prototype.canUndo = function () {
    return this._historyIndex >= 0
}

HistoryManager.prototype.clear = function () {
    this._histories = []
    this._historyIndex = -1
    this._transactionHistories = []
    this._betweenTransaction = false
    return this
}

HistoryManager.prototype.cloneValue = function () {

}

HistoryManager.prototype.getDataModel = function () {
    return this._dataModel
}

HistoryManager.prototype.getHistories = function () {
    return this._histories
}

HistoryManager.prototype.getHistoryIndex = function () {
    return this._historyIndex
}

HistoryManager.prototype.getMaxHistoryCount = function () {
    return this._maxHistoryCount
}

HistoryManager.prototype.isDisabled = function () {
    return this._disabled
}


HistoryManager.prototype.setDataModel = function (dataModel) {
    this._dataModel = dataModel
    return this
}

HistoryManager.prototype.setDisabled = function (disabled) {
    this._disabled = disabled
    return this
}

HistoryManager.prototype.setHistories = function (histories) {
    this._histories = histories
    this._historyIndex = histories.length - 1
    return this
}

HistoryManager.prototype.setHistoryIndex = function (historyIndex) {
    // 需要进行undo 和 redo
    historyIndex = historyIndex > this._histories.length - 1 ? this._histories.length - 1 : (historyIndex < -1 ? -1 : historyIndex)
    let currentHistoryIndex = this._historyIndex

    if(historyIndex > currentHistoryIndex){
        //redo
        for (let i = currentHistoryIndex; i < historyIndex; i++){
            this.redo()
        }
    }else if(historyIndex < currentHistoryIndex){
        //undo
        for(let i = currentHistoryIndex; i > historyIndex; i--){
            this.undo()
        }
    }
}

HistoryManager.prototype.setMaxHistoryCount = function (maxHistoryCount) {
    this._maxHistoryCount = maxHistoryCount
}

HistoryManager.prototype.undo = function () {
    if(!this.canUndo()){
        return
    }
    let events = this._histories[this._historyIndex]
    let disabled = this._disabled
    this.setDisabled(true)
    this._undoEvent(events)
    this.setDisabled(disabled)
    this._historyIndex--
    this.afterUndo()
}

HistoryManager.prototype._undoEvent = function (event) {
    if(Array.isArray(event)){
        event.forEach(e => this._undoEvent(e))
        return
    }

    let dataModel = this.getDataModel()
    let kind = event.kind
    switch (kind) {
        case "add":
            dataModel.remove(event.data)
            break
        case "remove":
            dataModel.add(event.data)
            break
        case "property":
            this._undoEventOfProperty(event)
            break
        case "dataModelProperty":
            this._undoEventOfDataModelProperty(event)
        default:
            break
    }
}
HistoryManager.prototype._undoEventOfDataModelProperty = function (event){
    let {oldValue, newValue} = event

    if(event.property.startsWith('a:')){
        let property = event.property.slice(2)
        this._dataModel.a(property, oldValue)
    }
}
HistoryManager.prototype._undoEventOfProperty = function (event){
    let {data, value, oldValue, newValue} = event

    switch (event.property) {
        case "p:translate":
            data.forEach(node => node.translate(value[0] * -1, value[1] * -1))
            break
        case "p:displayName":
            data.forEach(node => node.setDisplayName(oldValue))
            break
        case "p:width":
            data.forEach(node => node.setWidth(oldValue))
            break
        case "p:height":
            data.forEach(node => node.setHeight(oldValue))
            break
        case "p:position":
            data.forEach(node => node.setPosition(oldValue.x, oldValue.y))
            break
        case "p:rect":
            data.forEach(node => node.setRect(oldValue.x, oldValue.y, oldValue.width, oldValue.height))
            break
        default:
            if(event.property.startsWith('a:')){
                let property = event.property.slice(2)
                data.forEach(node => node.a(property, oldValue))
            }
            break
    }
}

HistoryManager.prototype.redo = function () {
    if(!this.canRedo()){
        return
    }
    this._historyIndex++
    let events = this._histories[this._historyIndex]
    let disabled = this._disabled
    this.setDisabled(true)
    this._redoEvent(events)
    this.setDisabled(disabled)
    this.afterRedo()
}

HistoryManager.prototype._redoEvent = function (event) {
    if(Array.isArray(event)){
        event.forEach(e => this._redoEvent(e))
        return
    }
    let dataModel = this.getDataModel()
    let kind = event.kind
    switch (kind) {
        case "add":
            dataModel.add(event.data)
            break
        case "remove":
            dataModel.remove(event.data)
            break
        case "property":
            this._redoEventOfProperty(event)
            break
        case "dataModelProperty":
            this._redoEventOfDataModelProperty(event)
        default:
            break
    }
}

HistoryManager.prototype._redoEventOfDataModelProperty = function (event){
    let {oldValue, newValue} = event

    if(event.property.startsWith('a:')){
        let property = event.property.slice(2)
        this._dataModel.a(property, newValue)
    }
}
HistoryManager.prototype._redoEventOfProperty = function (event) {
    let {data, value, oldValue, newValue} = event
    switch (event.property) {
        case "p:translate":
            data.forEach(node => node.translate(value[0], value[1]))
            break
        case "p:displayName":
            data.forEach(node => node.setDisplayName(newValue))
            break
        case "p:width":
            data.forEach(node => node.setWidth(newValue))
            break
        case "p:height":
            data.forEach(node => node.setHeight(newValue))
            break
        case "p:position":
            data.forEach(node => node.setPosition(newValue.x, newValue.y))
            break
        case "p:rect":
            data.forEach(node => node.setRect(newValue.x, newValue.y, newValue.width, newValue.height))
            break
        default:
            if(event.property.startsWith('a:')){
                let property = event.property.slice(2)
                data.forEach(node => node.a(property, newValue))
            }
            break
    }
}

export default HistoryManager