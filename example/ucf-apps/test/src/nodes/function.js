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



        // let textGroup =  document.createElementNS("http://www.w3.org/2000/svg","g")
        // textGroup.setAttribute('class', `sf-flow-node-label ${config.align==='right' ? 'sf-flow-node-label-right' : ''}`)
        // textGroup.setAttribute('x',0)
        // textGroup.setAttribute('y',0)
        // if(config.align==='right'){
        //     textGroup.setAttribute('transform',`translate(${this._width - 38}, ${this._height/2 + 6})`)
        // }else{
        //     textGroup.setAttribute('transform',`translate(38,${this._height/2 + 6})`)
        // }
        // this._view.__textGroup__ = textGroup
        // nodeContents.appendChild(textGroup)
        //
        // let displayName = document.createElementNS("http://www.w3.org/2000/svg","text")
        // displayName.setAttribute('class', 'sf-flow-node-label-text')
        // displayName.textContent = this._displayName
        // this._view.__textGroup__.__text__ = displayName
        // textGroup.appendChild(displayName)

        // if(config.inputs){
        //     let inputPortGroup = document.createElementNS("http://www.w3.org/2000/svg","g")
        //     inputPortGroup.setAttribute('class','sf-flow-node-port-input')
        //     inputPortGroup.setAttribute('transform', `translate(-5, ${this._height/2 - 5})`)
        //
        //     let inputPort =  document.createElementNS("http://www.w3.org/2000/svg","rect")
        //     inputPort.setAttribute('class' , 'sf-flow-node-port')
        //     inputPort.setAttribute('rx',3)
        //     inputPort.setAttribute('ry',3)
        //     inputPort.setAttribute('width',10)
        //     inputPort.setAttribute('height',10)
        //
        //     inputPortGroup.appendChild(inputPort)
        //
        //     this._view.__inputPortGroup__ = inputPortGroup
        //     this._view.__inputPortGroup__.__inputPort__ = inputPort
        //     nodeContents.appendChild(inputPortGroup)
        // }
        //
        // if(config.outputs){
        //     this._view.__outputPortGroup__ = []
        //     for(let i=0; i<config.outputs; i++){
        //         let outputPortGroup = document.createElementNS("http://www.w3.org/2000/svg","g")
        //         outputPortGroup.setAttribute('class','sf-flow-node-port-output')
        //         outputPortGroup.setAttribute('data-index',i)
        //         let ty = this._height/2 - config.outputs * 10 + 5 + i*20 //h/2 - protCount*portSize + portSize/2 + (i-1)*portSize
        //         outputPortGroup.setAttribute('transform', `translate(${this._width -5}, ${ty})`)
        //
        //         let outputPort =  document.createElementNS("http://www.w3.org/2000/svg","rect")
        //         outputPort.setAttribute('class' , 'sf-flow-node-port')
        //         outputPort.setAttribute('rx',3)
        //         outputPort.setAttribute('ry',3)
        //         outputPort.setAttribute('width',10)
        //         outputPort.setAttribute('height',10)
        //
        //         outputPortGroup.appendChild(outputPort)
        //         this._view.__outputPortGroup__.push(outputPortGroup)
        //         nodeContents.appendChild(outputPortGroup)
        //     }
        // }


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