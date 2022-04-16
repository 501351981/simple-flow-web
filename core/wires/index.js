import {generateLinkPath} from '../utils/wires'
import {generateId} from "../utils/node";
import $ from 'jquery'

function Wires(options) {
    let {id, source, sourcePort=0, target} = options
    this._id = id || generateId()
    this._source = source
    this._sourcePort = sourcePort
    this._target = target
    this._path = null
}

Wires.prototype.getId = function(){
    return this._id
}

Wires.prototype.getSource = function(){
    return this._source
}

Wires.prototype.getSourcePort = function(){
    return this._sourcePort
}

Wires.prototype.getTarget = function(){
    return this._target
}

Wires.prototype.getPath = function(){
    return this._path
}

Wires.prototype.selected = function(){
    this._path.setAttribute('class','sf-flow-link-line sf-flow-link-path sf-flow-link-selected')
}

Wires.prototype.deselected = function(){
    this._path.setAttribute('class','sf-flow-link-line sf-flow-link-path')
}

Wires.prototype.draw = function () {
    if(!this._source || !this._target){
        return
    }
    let [startX,startY] = this._source.getOutputPortCenter(this._sourcePort || 0)
    let [endX,endY] = this._target.getInputPortCenter()
    let d = generateLinkPath(startX,startY,endX,endY,1)
    let path = document.createElementNS("http://www.w3.org/2000/svg","path")
    path.setAttribute('id', this._id)
    path.setAttribute('class','sf-flow-link-line sf-flow-link-path')
    path.setAttribute('d', d)
    path.__data__ = {
        source: this._source,
        sourcePort: this._sourcePort,
        target: this._target
    }
    path.__node__ = this
    this._path = path
    return path
}

Wires.prototype.redraw = function () {
    if(!this._source || !this._target){
        return
    }
    let [startX,startY] = this._source.getOutputPortCenter(this._sourcePort)
    let [endX,endY] = this._target.getInputPortCenter()
    let d = generateLinkPath(startX,startY,endX,endY,1)
    this._path.setAttribute('d', d)
}

Wires.prototype.destroy = function () {
    $(this._path).remove()
    this.path = null

}
export default Wires
