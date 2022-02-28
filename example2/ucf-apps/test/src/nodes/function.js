import SF from '../../../../../core/index'
import Node from "../../../../../core/node";
class FunctionNode extends SF.Node{
    draw(){
        this._width = this._width || 100
        this._height = this._height || 100
        this._view = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        this._view.setAttribute('id',this._id)
        this._view.setAttribute('class','sf-flow-node')
        this._view.setAttribute('transform',`translate(${this._position.x},${this._position.y})`)

        let nodeContents = document.createDocumentFragment()
        let mainRect =  document.createElementNS("http://www.w3.org/2000/svg","circle");
        mainRect.setAttribute('class','sf-flow-node-main-rect')
        mainRect.setAttribute('cx',this._width / 2)
        mainRect.setAttribute('cy',this._width/2)
        mainRect.setAttribute('r',this._width/2)
        mainRect.setAttribute('fill','rgb(228, 145, 145)')
        this._view.__mainRect__ = mainRect
        nodeContents.appendChild(mainRect)

        this._view.append(nodeContents)

        this._view.__node__ = this
        return this._view
    }

    redraw(){
        if(!this._view){
            return
        }

        this._view.setAttribute('id',this._id)
        this._view.setAttribute('transform',`translate(${this._position.x},${this._position.y})`)

        let mainRect = this._view.__mainRect__
        mainRect.setAttribute('cx',this._width / 2)
        mainRect.setAttribute('cy',this._width/2)
        mainRect.setAttribute('r',this._width/2)

        this._dataModel.updateWires(this._id)
        return this
    }

    getInputPortCenter(index){
        let x = this._position.x
        let y = this._width/2 + this._position.y
        return [x,y]
    }

    getOutputPortCenter(index){
        let x = this._width  + this._position.x
        let y =  this._width/2 +  this._position.y
        return [x,y]

    }

}

export default FunctionNode
