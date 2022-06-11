import $ from 'jquery'
import throttle from 'lodash/throttle'
import {generateLinkPath} from '../utils/wires'

// 拖动节点使其移动
function dragNode(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel

    graphView._nodeLayer.delegate(".sf-flow-node", 'mousedown' , function (e) {
        e.stopPropagation()
        let target = e.currentTarget
        let node = target.__node__
        if(!node.canSelected()){
            return
        }

        let originalEvent = e.originalEvent
        let {clientX: originClientX, clientY: originClientY} = originalEvent
        let scale = graphView.getScale()

        let hisToryManager = dataModel.getHistoryManager()
        let disabled = hisToryManager.isDisabled()
        hisToryManager.setDisabled(true)
        let historyEvent = {
            kind: 'property',
            property: 'p:translate',
            value:[],
            data: []
        }

        let transLateX = 0
        let transLateY = 0

        function mousemoveHandle(event) {
            event.stopPropagation()
            let moveOriginalEvent = event.originalEvent
            moveOriginalEvent.preventDefault()
            let {clientX: cursorClientX, clientY: cursorClientY} = moveOriginalEvent
            let dx = (cursorClientX - originClientX) / scale
            let dy = (cursorClientY - originClientY) / scale
            graphView.sm().eachNode(function (node) {
                node.translate(dx, dy)
            })
            originClientX = cursorClientX
            originClientY = cursorClientY

            transLateX += dx
            transLateY += dy
        }
        let throttleMousemoveHandle = throttle(mousemoveHandle,20)
        function mouseupHandle(event) {
            event.stopPropagation()
            _eventLayer.unbind('mousemove', throttleMousemoveHandle)
            _eventLayer.unbind('mouseup', mouseupHandle)

            hisToryManager.setDisabled(disabled)
            if(transLateX !==0 || transLateY !== 0){
                graphView.sm().eachNode(function (node) {
                    historyEvent.data.push(node)
                })

                historyEvent.value = [transLateX, transLateY]
                hisToryManager.addHistory(historyEvent)
            }

        }

        _eventLayer.mousemove(throttleMousemoveHandle)
        _eventLayer.mouseup(mouseupHandle)
    })
}

function wire(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel
    // 连线，从输出管脚到输入管脚
    graphView._nodeLayer.delegate('.sf-flow-node-port-output','mousedown',function (e) {
        e.stopPropagation()
        if(!graphView.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行拖拽连线操作")
            }
            return
        }
        let target = e.currentTarget
        let source = $(target).parent()[0].__node__
        let sourcePort = target.getAttribute('data-index') * 1

        let [startX, startY] = source.getOutputPortCenter(sourcePort)

        _tempLinkLayer.empty()
        let path = document.createElementNS("http://www.w3.org/2000/svg","path")
        path.setAttribute('class','sf-flow-drag-line')
        _tempLinkLayer.append(path)

        let scale = graphView.getScale()

        function mousemoveHandle(event) {
            let moveOriginalEvent = event.originalEvent
            moveOriginalEvent.preventDefault()
            let {offsetX, offsetY} = moveOriginalEvent
            let endX = offsetX/scale
            let endY = offsetY/scale
            let d = generateLinkPath(startX,startY,endX,endY,1)
            path.setAttribute('d', d)

        }
        function inputMouseUpHandle(event) {
            let currentTarget = event.currentTarget
            let target = $(currentTarget).parent()[0].__node__

            let wire = dataModel.wire({
                source,
                sourcePort,
                target
            })
            graphView.sm().clearSelection().setSelection(wire)
            $('.sf-flow-node-port-input').unbind('mouseup', inputMouseUpHandle)
            _eventLayer.unbind('mousemove', mousemoveHandle)
            _eventLayer.unbind('mouseup', eventLayerMouseUpHandle)
            _tempLinkLayer.empty()
        }

        function eventLayerMouseUpHandle(event) {
            $('.sf-flow-node-port-input').unbind('mouseup', inputMouseUpHandle)
            _eventLayer.unbind('mousemove', mousemoveHandle)
            _eventLayer.unbind('mouseup', eventLayerMouseUpHandle)
            _tempLinkLayer.empty()
        }

        _eventLayer.mousemove(mousemoveHandle)
        $('.sf-flow-node-port-input').mouseup(inputMouseUpHandle)
        _eventLayer.mouseup(eventLayerMouseUpHandle)

    })

    // 连线，从输入管脚到输出管脚
    graphView._nodeLayer.delegate('.sf-flow-node-port-input','mousedown',function (e) {
        e.stopPropagation()
        if(!graphView.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行拖拽连线操作")
            }
            return
        }
        let currentTarget = e.currentTarget
        let target = $(currentTarget).parent()[0].__node__
        let [endX, endY] = target.getInputPortCenter()

        _tempLinkLayer.empty()
        let path = document.createElementNS("http://www.w3.org/2000/svg","path")
        path.setAttribute('class','sf-flow-drag-line')
        _tempLinkLayer.append(path)

        let scale = graphView.getScale()

        function mousemoveHandle(event) {
            let moveOriginalEvent = event.originalEvent
            moveOriginalEvent.preventDefault()
            let {offsetX, offsetY} = moveOriginalEvent
            let startX = offsetX/scale
            let startY = offsetY/scale
            let d = generateLinkPath(startX,startY,endX,endY,1)
            path.setAttribute('d', d)

        }

        function inputMouseupHandle(event) {
            let currentTarget = event.currentTarget
            let source = $(currentTarget).parent()[0].__node__
            let sourcePort = currentTarget.getAttribute('data-index') * 1

            let wire = dataModel.wire({
                source,
                sourcePort,
                target
            })

            graphView.sm().clearSelection().setSelection(wire)
            $('.sf-flow-node-port-output').unbind('mouseup', inputMouseupHandle)
            _eventLayer.unbind('mousemove', mousemoveHandle)
            _eventLayer.unbind('mouseup', eventLayerMouseupHandle)
            _tempLinkLayer.empty()

        }

        function eventLayerMouseupHandle(event) {
            $('.sf-flow-node-port-output').unbind('mouseup', inputMouseupHandle)
            _eventLayer.unbind('mousemove', mousemoveHandle)
            _eventLayer.unbind('mouseup', eventLayerMouseupHandle)
            _tempLinkLayer.empty()
        }

        _eventLayer.mousemove(mousemoveHandle)
        $('.sf-flow-node-port-output').mouseup(inputMouseupHandle)
        _eventLayer.mouseup(eventLayerMouseupHandle)

    })
}


function selectNode(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel

    graphView._nodeLayer.delegate(".sf-flow-node", 'mousedown' , function (e) {
        e.stopPropagation()
        let target = e.currentTarget
        let node = target.__node__
        let multiple = e.metaKey || e.ctrlKey

        if(!node.canSelected()){
            return
        }

        if(multiple){
            if(graphView.sm().contains(node)){
                graphView.sm().removeSelection(node)
            }else{
                graphView.sm().appendSelection(node)
            }

        }else if(!graphView.sm().contains(node)) {
            graphView.sm().clearSelection()
            graphView.sm().setSelection(node)

        }
    })
}

function selectWire(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel

    graphView._linkLayer.delegate(".sf-flow-link-path", 'mousedown' , function (e) {
        e.stopPropagation()
        let target = e.currentTarget
        let node = target.__node__
        let multiple = e.metaKey || e.ctrlKey
        if(multiple){
            if(graphView.sm().contains(node)){
                graphView.sm().removeSelection(node)
            }else{
                graphView.sm().appendSelection(node)
            }
        }else{
            graphView.sm().clearSelection()
            graphView.sm().setSelection(node)

        }
    })
}

function calcMousePosition(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel

    graphView._eventLayer.mousemove(function (e) {
        //计算鼠标移动时的逻辑点
        let originalEvent = e.originalEvent
        let {offsetX, offsetY} = originalEvent
        graphView.setOffsetX(offsetX).setOffsetY(offsetY)
    })
}

function groupSelect(graphView) {
    let _eventLayer = graphView._eventLayer
    let _tempLinkLayer = graphView._tempLinkLayer
    let dataModel = graphView._dataModel
    graphView._eventLayer.mousedown(function (e) {
        let startX = graphView.getOffsetX()
        let startY = graphView.getOffsetY()

        let originalEvent = e.originalEvent
        let {clientX: originClientX, clientY: originClientY} = originalEvent
        let scale = graphView.getScale()

        let rectDom = null
        let x = startX
        let y = startY
        let width = 0
        let height = 0

        function eventLayerMouseMoveHandle(e){
            if(!rectDom){
                rectDom = document.createElementNS("http://www.w3.org/2000/svg","rect")
                rectDom.setAttribute('class','sf-select-rect')
                rectDom.setAttribute('x',startX)
                rectDom.setAttribute('y',startY)
                rectDom.setAttribute('fill','rgba(20,125,255,.1)')
                rectDom.setAttribute('stroke','#ff7f0e')
                rectDom.setAttribute('stroke-width',1)
                rectDom.setAttribute('stroke-dasharray','10 5')
                graphView._selectLayer.append(rectDom)
            }

            let moveOriginalEvent = e.originalEvent
            let {clientX: cursorClientX, clientY: cursorClientY} = moveOriginalEvent
            width = (cursorClientX - originClientX) / scale
            height = (cursorClientY - originClientY) / scale

            if(width < 0){
                x = startX + width
            }else{
                x = startX
            }

            if(height < 0){
                y = startY + height

            }else{
                y = startY
            }
            rectDom.setAttribute('x', x)
            rectDom.setAttribute('y', y)
            rectDom.setAttribute('width', Math.abs(width))
            rectDom.setAttribute('height', Math.abs(height))

        }
        function eventLayerMouseUpHandle(e){
            let groupSelect = graphView._config.groupSelect
            graphView.sm().clearSelection().setSelection(graphView.getDatasInRect({
                x,
                y,
                width: Math.abs(width),
                height: Math.abs(height)
            },groupSelect.intersects, groupSelect.selectable))
            graphView._selectLayer.empty()
            graphView._eventLayer.unbind('mousemove', eventLayerMouseMoveHandle)
            graphView._eventLayer.unbind('mouseup', eventLayerMouseUpHandle)
        }
        graphView._eventLayer.mousemove(eventLayerMouseMoveHandle)
        graphView._eventLayer.mouseup(eventLayerMouseUpHandle)
    })
}

export function eventMixin(GraphView) {
    GraphView.prototype.initEvent = function () {
        dragNode(this)
        wire(this)
        selectNode(this)
        selectWire(this)
        calcMousePosition(this)
        groupSelect(this)
    }

    GraphView.prototype.getOffsetX = function () {
        return this._offsetX
    }

    GraphView.prototype.setOffsetX = function (offsetX) {
        this._offsetX = offsetX / this.getScale()
        return this
    }

    GraphView.prototype.getOffsetY = function () {
        return this._offsetY
    }

    GraphView.prototype.setOffsetY = function (offsetY) {
        this._offsetY = offsetY  / this.getScale()
        return this
    }

}
