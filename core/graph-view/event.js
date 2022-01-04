import $ from 'jquery'
import throttle from 'lodash/throttle'
import {generateLinkPath} from '../utils/wires'
export function eventMixin(GraphView) {
    GraphView.prototype.initEvent = function () {
        let _eventLayer = this._eventLayer
        let _tempLinkLayer = this._tempLinkLayer
        let graphView = this
        let dataModel = this._dataModel



        this._eventLayer.mousemove(function (e) {
            let originalEvent = e.originalEvent
            let {offsetX, offsetY} = originalEvent
            graphView.setOffsetX(offsetX).setOffsetY(offsetY)
        })

        this._eventLayer.mousedown(function () {
            graphView.sm().clearSelection()
        })
        // 拖动节点位置
        this._nodeLayer.delegate(".sf-flow-node", 'mousedown' , function (e) {
            e.stopPropagation()
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

        // 连线，从输出管脚到输入管脚
        this._nodeLayer.delegate('.sf-flow-node-port-output','mousedown',function (e) {
            console.log('port mousedown',e)
            e.stopPropagation()
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
                console.log('mouseup')
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
        this._nodeLayer.delegate('.sf-flow-node-port-input','mousedown',function (e) {
            e.stopPropagation()
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

        //点击选中节点
        this._nodeLayer.delegate(".sf-flow-node", 'mousedown' , function (e) {
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

            }else if(!graphView.sm().contains(node)) {
                graphView.sm().clearSelection()
                graphView.sm().setSelection(node)

            }
        })

        //点击选中连线
        this._linkLayer.delegate(".sf-flow-link-path", 'mousedown' , function (e) {
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