import {addShortcut} from "../utils/shortcut/index";

export function shortcutMixin(GraphView) {
    GraphView.prototype.initShortcut = function () {
        let eventLayer = this.getEventLayer()[0]
        console.log('eventLayer',eventLayer)
        const shortcutConfig = [
            {
                name: 'copy',
                keyboardShortcut: ['Ctrl+C', 'Meta+C'],
                propagate: false,
                target: eventLayer,
                action: copySelectNodes.bind(this),
            },
            {
                name: 'paste',
                keyboardShortcut: ['Ctrl+V', 'Meta+V'],
                propagate: true,
                target: eventLayer,
                action: pasteNodes.bind(this),
            },
            {
                name: 'selectAll',
                keyboardShortcut: ['Ctrl+A', 'Meta+A'],
                propagate: true,
                target: eventLayer,
                action: selectAll.bind(this),
            },
            {
                name: 'delete',
                keyboardShortcut: ['BackSpace'],
                propagate: true,
                target: eventLayer,
                action: deleteSelectNodes.bind(this),
            },
            {
                name: 'undo',
                keyboardShortcut: ['Ctrl+Z',  'Meta+Z'],
                propagate: false,
                target: eventLayer,
                action: undo.bind(this),
            },
            {
                name: 'redo',
                keyboardShortcut: ['Ctrl+Y',  'Meta+Y'],
                propagate: false,
                target: eventLayer,
                action: redo.bind(this),
            },
        ]
        addShortcut(shortcutConfig)
    }

    function undo() {
        this.dm().getHistoryManager().undo()
    }

    function redo() {
        this.dm().getHistoryManager().redo()
    }

    function copySelectNodes() {
        let nodes = this.sm().getSelection()
        if(nodes.length){
            let json = this.getDataModel().serializeNodes(nodes)
            window.localStorage.setItem('sfCopyData',json)
        }
    }

    function pasteNodes(event) {
        let copyData = window.localStorage.getItem('sfCopyData') || '[]'
        let dataModel = this.getDataModel()
        let [nodes, wires] = dataModel.deserializeNodes(copyData)
        let [minX,minY, maxX, maxY] = dataModel.getBoundsOfNodes(nodes)
        if(nodes.length){
            let mouseX = this.getOffsetX()
            let mouseY = this.getOffsetY()
            let dx = mouseX - minX
            let dy = mouseY - minY
            for(let i = 0; i < nodes.length; i++){
                nodes[i].translate(dx, dy)
            }
        }
        let datas = [...nodes,...wires]
        dataModel.add(datas)
        this.sm().clearSelection().setSelection(datas)
    }

    function deleteSelectNodes() {
        let datas = this.sm().getSelection()
        this.getDataModel().remove(datas)
    }

    function selectAll() {
        this.sm().selectAll()
    }
}