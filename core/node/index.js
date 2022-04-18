import $ from 'jquery'
import {generateId} from "../utils/node";
import DataModel from "../data-model";

const NODE_WIDTH = 100
const NODE_HEIGHT = 40
function Node(options,dataModel) {
    this._dataModel = dataModel
    let type = options.type
    let {
        id,
        p:{displayName,position={x:undefined,y:undefined}, width, height} = {position:{x:0,y:0}},
        a={},
        wires=[]
    } = options
    this._type = type
    this._id = id || generateId()
    this._displayName = displayName
    this._position = position
    this._width = width
    this._height = height
    this._attrObj = a
    this._wires = wires
    this._view = null
}

Node.prototype.getType = function() {
    return this._type
}

Node.prototype.getAttr = function (name) {
    return this._attrObj[name]
}

Node.prototype.getAttrObject = function(){
    return this._attrObj
}

Node.prototype.setAttr = function (name,value) {
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setAttr操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: `a:${name}`,
        data: [this],
        oldValue: this.getAttr(name),
        newValue: value
    }
    this._attrObj[name] = value
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.a = function () {
    if(arguments.length===1){
        if(typeof arguments[0] === 'string'){
            return this.getAttr(arguments[0])
        }else if(typeof arguments[0] === 'object'){
            if(!this.getEditable()){
                if(process.env.NODE_ENV === 'development'){
                    console.warn("getEditable = false，不能进行a(object)操作")
                }
                return
            }
            let historyEvents = []
            for(let key in arguments[0]){
                historyEvents.push({
                    kind: 'property',
                    property: `a:${key}`,
                    data: [this],
                    oldValue: this.getAttr(key),
                    newValue:  arguments[0][key]
                })
                this._attrObj[key] = arguments[0][key]
            }
            this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvents)
            return this
        }

    }
    if(arguments.length===2){
        this.setAttr(arguments[0], arguments[1])
        return this
    }
}

Node.prototype.canSelected = function () {
    return !(this.a('selectable') === false)
}

Node.prototype.setDataModel = function(dataModel){
    this._dataModel =dataModel
    return this
}

Node.prototype.getId = function(){
    return this._id
}

Node.prototype.setId = function(id){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setId操作")
        }
        return
    }
    this._id = id
    this.redraw()
    return this
    // 通知dataModel修改
}

Node.prototype.getDisplayName = function(){
    return this._displayName
}

Node.prototype.setDisplayName = function(displayName){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setDisplayName操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:displayName',
        data: [this],
        oldValue: this._displayName,
        newValue: displayName
    }
    this._displayName = displayName
    this.redraw()
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.getWidth = function(){
    return this._width
}

Node.prototype.setWidth = function(width){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setWidth操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:width',
        data: [this],
        oldValue: this._width,
        newValue: width
    }

    this._width = width
    this.redraw()
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.getHeight = function(){
    return this._height
}

Node.prototype.setHeight = function(height){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setHeight操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:height',
        data: [this],
        oldValue: this._height,
        newValue: height
    }
    this._height = height
    this.redraw()
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.getPosition = function(){
    return {...this._position}
}

Node.prototype.setPosition = function(x,y){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setPosition操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:position',
        data: [this],
        oldValue: this.getPosition(),
        newValue: {x,y}
    }
    this._position = {x,y}
    this.redraw()
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.getRect = function(){
    return {
        ...this._position,
        width: this._width,
        height: this._height
    }
}

Node.prototype.setRect = function(x, y, width, height){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setRect操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:rect',
        data: [this],
        oldValue: {x: this._position.x, y: this._position.y, width: this._width, height: this._height},
        newValue: {x, y, width, height}
    }
    this._position.x = x
    this._position.y = y
    this._width = width
    this._height = height
    this.redraw()
    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.translate = function(tx = 0, ty = 0){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行translate操作")
        }
        return
    }
    let historyEvent = {
        kind: 'property',
        property: 'p:translate',
        data: [this],
        value: [tx, ty]
    }

    let {x, y} = this._position
    this._position.x = x + tx
    this._position.y = y + ty
    this.redraw()

    this._dataModel &&  this._dataModel.getHistoryManager().addHistory(historyEvent)
    return this
}

Node.prototype.getWires = function(){
    return [...this._wires]
}

Node.prototype.setWires = function(wires){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行setWires操作")
        }
        return
    }
    this._wires = wires
    return this
}

Node.prototype.removeWires = function(port, targetId){
    if(!this.getEditable()){
        if(process.env.NODE_ENV === 'development'){
            console.warn("getEditable = false，不能进行removeWires操作")
        }
        return
    }
    let wires = this._wires[port] || []
    for(let i=0; i < wires.length; i++){
        if(wires[i] === targetId){
            wires.splice(i,1)
            break
        }
    }
    return this
}

Node.prototype.isWireTo = function(targetId){
    for(let port = 0; port < this._wires.length; port++){
        let wires = this._wires[port]
        if(wires.includes(targetId)){
            return true
        }
    }
    return false
}

Node.prototype.getOutputPortCenter = function(index){
    let config = this._dataModel.getNodeConfig(this._type)
    let x = this._width  + this._position.x
    let y = this._height/2 - config.outputs * 10 + 10 + index*20 + this._position.y
    return [x,y]

}

Node.prototype.getInputPortCenter = function(index){
    let x = this._position.x
    let y = this._height/2 + this._position.y
    return [x,y]
}

Node.prototype.selected = function(){
    this._view.setAttribute('class','sf-flow-node sf-flow-node-selected')
    return this
}

Node.prototype.deselected = function(){
    this._view.setAttribute('class','sf-flow-node')
    return this
}

Node.prototype.draw = function () {
    let config = this._dataModel.getNodeConfig(this._type)
    this._width = this._width || config.width || NODE_WIDTH
    this._height = this._height || config.height || NODE_HEIGHT
    this._view = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this._view.setAttribute('id',this._id)
    this._view.setAttribute('class','sf-flow-node')
    this._view.setAttribute('transform',`translate(${this._position.x},${this._position.y})`)

    let nodeContents = document.createDocumentFragment()
    let mainRect =  document.createElementNS("http://www.w3.org/2000/svg","rect");
    mainRect.setAttribute('class','sf-flow-node-main-rect')
    mainRect.setAttribute('rx',5)
    mainRect.setAttribute('ry',5)
    mainRect.setAttribute('width',this._width)
    mainRect.setAttribute('height',this._height)
    mainRect.setAttribute('fill',config.bgColor || '#87a980')
    this._view.__mainRect__ = mainRect
    nodeContents.appendChild(mainRect)

    if(config.icon){
        let iconGroupEl = document.createElementNS("http://www.w3.org/2000/svg","g")
        iconGroupEl.setAttribute('class', `sf-flow-node-icon-group ${config.align==='right'? 'sf-flow-node-icon-group-right':''}`)
        iconGroupEl.setAttribute('x',0)
        iconGroupEl.setAttribute('y',0)
        config.align==='right' && iconGroupEl.setAttribute('transform',`translate(${this._width - 30},0)`)
        this._view.__iconGroup__ = iconGroupEl

        let iconShade =  document.createElementNS("http://www.w3.org/2000/svg","rect")
        iconShade.setAttribute("x",0);
        iconShade.setAttribute("y",0);
        iconShade.setAttribute("class","sf-flow-node-icon-shade")
        iconShade.setAttribute("width",30);
        iconShade.setAttribute("height",this._height);
        this._view.__iconShade__ = iconShade
        iconGroupEl.appendChild(iconShade)

        let iconShadeBorder = document.createElementNS("http://www.w3.org/2000/svg","path")
        iconShadeBorder.setAttribute("class", "sf-flow-node-icon-shade-border")
        iconShadeBorder.setAttribute('d',config.align === 'right' ? `M 0 0 L 0 ${this._height}` : `M 30 0 L 30 ${this._height}`)
        this._view.__iconShadeBorder__ = iconShadeBorder
        iconGroupEl.appendChild(iconShadeBorder)

        let image = document.createElementNS("http://www.w3.org/2000/svg","image")
        image.setAttribute('href', config.icon)
        image.setAttribute('width',30)
        image.setAttribute('height',30)
        image.setAttribute('transform',`translate(0,${(this._height - 30)/2})`)
        this._view.__image__ = image
        iconGroupEl.appendChild(image)

        nodeContents.appendChild(iconGroupEl)
    }

    let textGroup =  document.createElementNS("http://www.w3.org/2000/svg","g")
    textGroup.setAttribute('class', `sf-flow-node-label ${config.align==='right' ? 'sf-flow-node-label-right' : ''}`)
    textGroup.setAttribute('x',0)
    textGroup.setAttribute('y',0)
    if(config.align==='right'){
        textGroup.setAttribute('transform',`translate(${this._width - 38}, ${this._height/2 + 6})`)
    }else{
        textGroup.setAttribute('transform',`translate(38,${this._height/2 + 6})`)
    }
    this._view.__textGroup__ = textGroup
    nodeContents.appendChild(textGroup)

    let displayName = document.createElementNS("http://www.w3.org/2000/svg","text")
    displayName.setAttribute('class', 'sf-flow-node-label-text')
    displayName.textContent = this._displayName
    this._view.__textGroup__.__text__ = displayName
    textGroup.appendChild(displayName)

    if(config.inputs){
        let inputPortGroup = document.createElementNS("http://www.w3.org/2000/svg","g")
        inputPortGroup.setAttribute('class','sf-flow-node-port-input')
        inputPortGroup.setAttribute('transform', `translate(-5, ${this._height/2 - 5})`)

        let inputPort =  document.createElementNS("http://www.w3.org/2000/svg","rect")
        inputPort.setAttribute('class' , 'sf-flow-node-port')
        inputPort.setAttribute('rx',3)
        inputPort.setAttribute('ry',3)
        inputPort.setAttribute('width',10)
        inputPort.setAttribute('height',10)

        inputPortGroup.appendChild(inputPort)

        this._view.__inputPortGroup__ = inputPortGroup
        this._view.__inputPortGroup__.__inputPort__ = inputPort
        nodeContents.appendChild(inputPortGroup)
    }

    if(config.outputs){
        this._view.__outputPortGroup__ = []
        for(let i=0; i<config.outputs; i++){
            let outputPortGroup = document.createElementNS("http://www.w3.org/2000/svg","g")
            outputPortGroup.setAttribute('class','sf-flow-node-port-output')
            outputPortGroup.setAttribute('data-index',i)
            let ty = this._height/2 - config.outputs * 10 + 5 + i*20 //h/2 - protCount*portSize + portSize/2 + (i-1)*portSize
            outputPortGroup.setAttribute('transform', `translate(${this._width -5}, ${ty})`)

            let outputPort =  document.createElementNS("http://www.w3.org/2000/svg","rect")
            outputPort.setAttribute('class' , 'sf-flow-node-port')
            outputPort.setAttribute('rx',3)
            outputPort.setAttribute('ry',3)
            outputPort.setAttribute('width',10)
            outputPort.setAttribute('height',10)

            outputPortGroup.appendChild(outputPort)
            this._view.__outputPortGroup__.push(outputPortGroup)
            nodeContents.appendChild(outputPortGroup)
        }
    }


    this._view.append(nodeContents)
    this._view.__node__ = this
    return this._view
}

Node.prototype.redraw = function () {
    if(!this._view){
        return
    }

    let config = this._dataModel.getNodeConfig(this._type)

    this._view.setAttribute('id',this._id)
    this._view.setAttribute('transform',`translate(${this._position.x},${this._position.y})`)

    this._view.__mainRect__.setAttribute('width',this._width)
    this._view.__mainRect__.setAttribute('height',this._height)

    if(config.icon){
        config.align==='right' && this._view.__iconGroup__.setAttribute('transform',`translate(${this._width - 30},0)`)
        this._view.__iconShade__.setAttribute("height",this._height);
        this._view.__iconShadeBorder__.setAttribute('d',config.align === 'right' ? `M 0 0 L 0 ${this._height}` : `M 30 0 L 30 ${this._height}`)
        this._view.__image__.setAttribute('transform',`translate(0,${(this._height - 30)/2})`)
    }


    if(config.align==='right'){
        this._view.__textGroup__.setAttribute('transform',`translate(${this._width - 38}, ${this._height/2 + 6})`)
    }else{
        this._view.__textGroup__.setAttribute('transform',`translate(38,${this._height/2 + 6})`)
    }

    this._view.__textGroup__.__text__.textContent = this._displayName

    if(config.inputs){
        this._view.__inputPortGroup__.setAttribute('transform', `translate(-5, ${this._height/2 - 5})`)
    }

    if(config.outputs){
        for(let i=0; i<config.outputs; i++){
            let ty = this._height/2 - config.outputs * 10 + 5 + i*20 //h/2 - protCount*portSize + portSize/2 + (i-1)*portSize
            this._view.__outputPortGroup__[i].setAttribute('transform', `translate(${this._width -5}, ${ty})`)
        }
    }
    this._dataModel.updateWires(this._id)
    return this
}

Node.prototype.destroy = function () {
    $(this._view).remove()
    this._view = null
}

Node.prototype.moveToTop = function (){
    let parentNode = this._view.parentNode
    parentNode.removeChild(this._view)
    parentNode.appendChild(this._view)

}
Node.prototype.moveToBottom = function (){
    let parentNode = this._view.parentNode
    parentNode.removeChild(this._view)
    parentNode.prepend(this._view)

}
Node.prototype.insertBefore = function (referenceNode){
    let parentNode = this._view.parentNode
    parentNode.insertBefore(this._view, referenceNode._view)
}

Node.prototype.getEditable = function (){
    if(this._dataModel){
        return this._dataModel.getEditable()
    }else {
        return true
    }

}
export default Node
