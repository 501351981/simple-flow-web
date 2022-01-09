import Node from "../node/index";
import Wires from '../wires/index'
export  function nodeMixin(DataModel) {

    // 反序列化图纸
    DataModel.prototype.deserialize = function (json) {
        if(typeof json === 'string'){
            json = JSON.parse(json)
        }

        let {width = 5000, height = 5000, gridSize = 20, background = '#fff'} = json.p || {}
        let graphView = this._graphView
        graphView.setWidth(width).setHeight(height).setGridSize(gridSize).setBackground(background)

        //调用graphView方法，修改页面配置
        this._attrObj = json.a || {}

        let nodesConfig = json.d || []
        let nodesEl = document.createDocumentFragment()

        for(let i=0; i < nodesConfig.length; i++){
            let nodeConfig = nodesConfig[i]
            if(nodeConfig.id){
                let type = nodeConfig.type
                let NodeConstruct = type && this.getNodeConfig(type)
                let node
                if(typeof NodeConstruct === 'function'){
                    node = new NodeConstruct(nodeConfig, this)
                    console.log('node',node)

                }else{
                    node = new Node(nodeConfig, this)
                }

                this._nodes[nodeConfig.id] = node
                nodesEl.appendChild(node.draw())
            }
        }

        let linksEl = document.createDocumentFragment()

        Object.keys(this._nodes).forEach((id)=>{
            let source = this._nodes[id]
            let wires = source.getWires()
            if(wires.length){
                for(let sourcePort=0; sourcePort < wires.length; sourcePort++){
                    let wiresItem = wires[sourcePort]
                    for(let i=0; i < wiresItem.length; i++){
                        let link = new Wires({
                            id: `${id}-${sourcePort}-${wiresItem[i]}`,
                            source,
                            sourcePort,
                            target: this._nodes[wiresItem[i]]
                        })
                        this._wires[link.getId()] = link
                        if(!this._wiresBySourceId[id]){
                            this._wiresBySourceId[id] = []
                        }
                        this._wiresBySourceId[id].push(link)

                        if(!this._wiresByTargetId[wiresItem[i]]){
                            this._wiresByTargetId[wiresItem[i]] = []
                        }
                        this._wiresByTargetId[wiresItem[i]].push(link)

                        let linkEl = link.draw()
                        linkEl && linksEl.appendChild(linkEl)
                    }
                }
            }
        })

        this._graphView.getNodeLayer().append(nodesEl)
        this._graphView.getLinkLayer().append(linksEl)
    }

    // 反序列化部分节点，输入为serializeNodes的返回值
    // setId，保留原id
    DataModel.prototype.deserializeNodes = function(data, setId = false){
        let nodeIds = {}
        let nodeIdMap = {} //老的id 和新的id之间的映射关系
        let nodesData = []
        let wiresData = []
        if(typeof data === 'string'){
            data = JSON.parse(data)
        }

        for(let i = 0; i < data.length; i++){
            let nodeConfig = data[i]
            let oldId = nodeConfig.id
            if(!setId){
                delete nodeConfig.id
            }
            let node = new Node(nodeConfig, this)
            let newId = node.getId()
            nodeIds[newId] = node
            nodesData.push(node)
            nodeIdMap[oldId] = newId
        }

        for(let i = 0; i < nodesData.length; i++){
            let node = nodesData[i]
            let wires = node.getWires()
            for(let port = 0; port < wires.length; port++){
                let portWires = wires[port] || []
                let newPortWires = []
                 portWires.forEach(targetId => {
                    if(nodeIds[nodeIdMap[targetId]]){
                        let wire = new Wires({
                            id: `${node.getId()}-${port}-${nodeIdMap[targetId]}`,
                            source: node,
                            sourcePort: port,
                            target: nodeIds[nodeIdMap[targetId]]
                        })
                        wiresData.push(wire)
                        newPortWires.push(nodeIdMap[targetId])
                    }
                })
                wires[port] = newPortWires
            }
            node.setWires(wires)
        }
        return [nodesData, wiresData]
    }

    //序列化图纸
    DataModel.prototype.serialize = function (space) {
        let json = {}
        let graphView = this._graphView
        json.v = graphView.getVersion()
        json.p = {
            width: graphView.getWidth(),
            height: graphView.getHeight(),
            gridSize: graphView.getGridSize(),
            background: graphView.getBackground()
        }
        json.a = this._attrObj

        json.d = Object.keys(this._nodes).map(nodeId => {
            let node = this._nodes[nodeId]
            return {
                type: node.getType(),
                id: node.getId(),
                p:{
                    displayName: node.getDisplayName(),
                    position: node.getPosition(),
                    width: node.getWidth(),
                    height: node.getHeight(),
                },
                a: node.getAttrObject(),
                wires: node.getWires()
            }
        })

        return JSON.stringify(json, null, space)
    }

    // 序列化一组节点，用于节点的复制
    DataModel.prototype.serializeNodes = function(nodes, space){
        let nodeIds = {}
        let data = []

        // 收集所有nodeId，只保留所有node之间的连线关系
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i]
            if(node instanceof Node){
                nodeIds[node.getId()] = true
            }

        }
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i]
            if(node instanceof Node){
                data.push({
                    type: node.getType(),
                    id: node.getId(),
                    p:{
                        displayName: node.getDisplayName(),
                        position: node.getPosition(),
                        width: node.getWidth(),
                        height: node.getHeight(),
                    },
                    a: node.getAttrObject(),
                    wires: node.getWires().map(wires => wires.filter(nodeId => nodeIds[nodeId]))
                })
            }
        }

        return JSON.stringify(data, null, space)
    }


    DataModel.prototype.add = function (datas) {
        let historyEvent = {
            kind: "add",
            data: []
        }
        if(Array.isArray(datas)){
            let nodesEl = document.createDocumentFragment()
            let wiresEl = document.createDocumentFragment()

            for(let i = 0; i < datas.length; i++){
                if(datas[i] instanceof Node){
                    let node = datas[i]
                    let nodeId = node.getId()
                    if(this._nodes[nodeId]){
                        console.error(("[id已存在]:" + nodeId))
                        continue
                    }
                    node.setDataModel(this)
                    this._nodes[nodeId] = node
                    nodesEl.appendChild(node.draw())

                    historyEvent.data.push(node)
                }else{
                    let wires = datas[i]
                    let wiresId = wires.getId()
                    if(this._wires[wiresId]){
                        console.error(("[id已存在]:" + wiresId))
                        continue
                    }

                    let source = wires.getSource()
                    let target = wires.getTarget()
                    let sourceId = source.getId()
                    let targetId = target.getId()
                    let sourcePort = wires.getSourcePort()

                    //检查source中是否存储此线
                    let sourceWires = source.getWires()
                    if(!sourceWires[sourcePort]){
                        sourceWires[sourcePort] = []
                    }
                    if(!sourceWires[sourcePort].includes(targetId)){
                        sourceWires[sourcePort].push(targetId)
                        source.setWires(sourceWires)
                    }

                    this._wires[wiresId] = wires

                    if(!this._wiresBySourceId[sourceId]){
                        this._wiresBySourceId[sourceId] = []
                    }
                    this._wiresBySourceId[sourceId].push(wires)


                    if(!this._wiresByTargetId[targetId]){
                        this._wiresByTargetId[targetId] = []
                    }
                    this._wiresByTargetId[targetId].push(wires)
                    let linkEl = wires.draw()
                    linkEl &&  wiresEl.appendChild(linkEl)

                    historyEvent.data.push(wires)
                }
            }

            this._graphView.getNodeLayer().append(nodesEl)
            this._graphView.getLinkLayer().append(wiresEl)
        }else{
            if(datas instanceof Node){
                let node = datas
                let nodeId = node.getId()
                if(this._nodes[nodeId]){
                    console.error(("[id已存在]:" + nodeId))
                    return
                }
                node.setDataModel(this)
                this._nodes[nodeId] = node
                this._graphView.getNodeLayer().append(node.draw())

                historyEvent.data.push(node)

            }else{
                let wires = datas
                let wiresId = wires.getId()
                if(this._wires[wiresId]){
                    console.error(("[id已存在]:" + wiresId))
                    return
                }

                let source = wires.getSource()
                let target = wires.getTarget()
                let sourceId = source.getId()
                let targetId = target.getId()
                let sourcePort = wires.getSourcePort()

                //检查source中是否存储此线
                let sourceWires = source.getWires()
                if(!sourceWires[sourcePort]){
                    sourceWires[sourcePort] = []
                }
                if(!sourceWires[sourcePort].includes(targetId)){
                    sourceWires[sourcePort].push(targetId)
                    source.setWires(sourceWires)
                }


                this._wires[wiresId] = wires

                if(!this._wiresBySourceId[sourceId]){
                    this._wiresBySourceId[sourceId] = []
                }
                this._wiresBySourceId[sourceId].push(wires)


                if(!this._wiresByTargetId[targetId]){
                    this._wiresByTargetId[targetId] = []
                }
                this._wiresByTargetId[targetId].push(wires)
                let linkEl = wires.draw()
                linkEl &&  this._graphView.getLinkLayer().append(linkEl)

                historyEvent.data.push(wires)
            }
        }

        if(historyEvent.data.length){
            this._historyManager.addHistory(historyEvent)
            this._fireDataModelChangeListener(historyEvent)
        }
        return this
    }

    DataModel.prototype.wire = function({source,sourcePort,target}){
        let historyEvent = {
            kind: "add",
            data: []
        }

        let originWires = source.getWires()
        let sourceId = source.getId()
        let targetId = target.getId()

        // 如果已存在，则忽略
        if(originWires.length){
            let targets = originWires[sourcePort] || []
            if(targets.includes(targetId)){
                return
            }
        }

        for(let i=0;i<=sourcePort;i++){
            if(!originWires[i]){
                originWires[i] = []
            }
        }

        originWires[sourcePort].push(targetId)
        source.setWires(originWires)

        let link = new Wires({
            id: `${sourceId}-${sourcePort}-${targetId}`,
            source,
            sourcePort,
            target: target
        })

        this._wires[link.getId()] = link

        if(!this._wiresBySourceId[sourceId]){
            this._wiresBySourceId[sourceId] = []
        }
        this._wiresBySourceId[sourceId].push(link)


        if(!this._wiresByTargetId[targetId]){
            this._wiresByTargetId[targetId] = []
        }
        this._wiresByTargetId[targetId].push(link)

        let linkEl = link.draw()
        linkEl &&  this._graphView.getLinkLayer().append(linkEl)

        historyEvent.data.push(link)
        this._historyManager.addHistory(historyEvent)
        this._fireDataModelChangeListener(historyEvent)
        return link
    }

    DataModel.prototype.getDataById = function (id) {
        return this._nodes[id] || this._wires[id]
    }

    DataModel.prototype.updateWires = function (nodeId, type = 'all') {
        let links = []
       switch (type) {
           case "source":
               links = this._wiresBySourceId[nodeId] || []
               break
           case "target":
                links = this._wiresByTargetId[nodeId] || []
           case "all":
               links = [].concat(this._wiresBySourceId[nodeId] || []).concat(this._wiresByTargetId[nodeId] || [])
               break
           default:
               break
       }
       links.forEach(link => link.redraw())
    }

    DataModel.prototype.each = function (func, type = 'all') {
        switch (type) {
            case "all":
                this.eachNode(func)
                this.eachWires(func)
                break;
            case 'node':
                this.eachNode(func)
                break
            case 'wires':
                this.eachWires(func)
                break;
        }
    }

    DataModel.prototype.eachNode = function (func) {
        Object.keys(this._nodes).forEach(nodeId => {
            try {
                func(this._nodes[nodeId])
            }catch (e) {
                console.warn(e)
            }
        })
    }

    DataModel.prototype.eachWires = function (func) {
        Object.keys(this._wires).forEach(wiresId => {
            try {
                func(this._wires[wiresId])
            }catch (e) {
                console.warn(e)
            }
        })
    }

    DataModel.prototype.clear = function () {
        //待实现
        //清楚所有数据
        //history
    }

    DataModel.prototype.remove = function (datas) {
        let historyEvent = {
            kind: "remove",
            data: Array.isArray(datas) ? [...datas] : [datas]
        }

        if(Array.isArray(datas)){
            let tempDatas = [...datas]
            for(let i = 0; i < tempDatas.length; i++){
                let node = tempDatas[i]
                if(node instanceof Node){
                   let removedWires = this.removeNode(node)
                    historyEvent.data = historyEvent.data.concat(removedWires)

                }else if(node instanceof Wires){
                    this.removeWires(node)
                }
            }
        }else{
            if(datas instanceof Node){
                this.removeNode(datas)
            }else if(datas instanceof Wires){
                this.removeWires(datas)
            }
        }

        this._historyManager.addHistory(historyEvent)
        this._fireDataModelChangeListener(historyEvent)
        return this
    }

    DataModel.prototype.removeNode = function(node){
        let removedWires = []
        //找到node相关的连线，先删除连线
        let nodeId = node.getId()
        let wiresBySourceId = [...this._wiresBySourceId[nodeId] || []]

        wiresBySourceId.forEach(wires => {
            this.removeWires(wires)
            removedWires.push(wires)
        })

        let wiresByTargetId = [...this._wiresByTargetId[nodeId] || []]
        wiresByTargetId.forEach(wires => {
            this.removeWires(wires)
            removedWires.push(wires)
        })
        //清楚dataModel中的缓存
        delete this._nodes[nodeId]

        //从选中的节点中删除
        let sm = this._graphView.sm()
        if(sm.contains(node)){
            sm.removeSelection(node)
        }
        //删除node本身
        node.destroy()
        return removedWires
    }

    DataModel.prototype.removeWires = function(wires){
        // 找到线的source节点
        let wiresId = wires.getId()
        let source = wires.getSource()
        let sourceId = source.getId()
        let sourcePort = wires.getSourcePort()
        let target = wires.getTarget()
        let targetId = target.getId()

        //去除source节点中的wires数据
        source.removeWires(sourcePort, targetId)

        //去除dataModel中的缓存数据
        let wiresBySourceId = this._wiresBySourceId[sourceId]
        for(let i = 0; i < wiresBySourceId.length; i++){
            if(wiresBySourceId[i] === wires){
                wiresBySourceId.splice(i,1)
                break
            }
        }

        let wiresByTargetId = this._wiresByTargetId[targetId]
        for(let i = 0; i < wiresByTargetId.length; i++){
            if(wiresByTargetId[i] === wires){
                wiresByTargetId.splice(i,1)
                break
            }
        }

        delete this._wires[wiresId]

        //从选中的曲线中删除
        let sm = this._graphView.sm()
        if(sm.contains(wires)){
            sm.removeSelection(wires)
        }

        //销毁曲线本身
        wires.destroy()

    }

    DataModel.prototype.removeDataById = function (id) {
        let node = this.getDataById(id)
        this.remove(node)
    }

    DataModel.prototype.getBoundsOfNodes = function (nodes = []) {
        let xMin = []
        let xMax = []
        let yMin = []
        let yMax = []
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i]
            if(node instanceof Node){
                let {x, y, width, height} = node.getRect()
                xMin.push(x)
                xMax.push(x + width)
                yMin.push(y)
                yMax.push(y + height)
            }
        }
        return xMin.length ? [Math.min(...xMin), Math.min(...yMin),Math.max(...xMax), Math.max(...yMax)] : []
    }

}