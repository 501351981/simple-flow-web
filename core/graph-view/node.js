import $ from 'jquery'

export  function nodeMixin(GraphView) {
    GraphView.prototype.registerNode = function (type,config) {
        this._nodeTypes[type] = config
    }

    GraphView.prototype.getNodeConfig = function (type) {
        return this._nodeTypes[type]
    }

    GraphView.prototype.getDataModel = function () {
        return this._dataModel
    }

    GraphView.prototype.dm = function () {
        return this.getDataModel()
    }

    /*
    * rect: 逻辑坐标区域
    * intersects: 指定相交选中还是包含选中，true表示相交，false表示包含。
    * selectable: 是否只返回可被选中的图元，可否被选中通过isSelectable判断
    * */
    GraphView.prototype.getDatasInRect = function (rect, intersects = true, selectable = true) {
        let {x, y, width, height} = rect
        if(width <= 10 || height <= 10){
            return []
        }

        let datas = []

        this._dataModel.eachNode(node => {
            let {x: nodeX, y: nodeY, width: nodeWidth, height: nodeHeight} = node.getRect()
            if(selectable && !node.canSelected()){
                return
            }

            if(intersects){
                //相交
                let dx = Math.abs(x*2 + width - nodeX*2 - nodeWidth)
                let dy = Math.abs(y*2 + height - nodeY*2 - nodeHeight)

                if(dx < width + nodeWidth && dy < height + nodeHeight){
                    datas.push(node)
                }

            }else{
                //包含
                if(width >= width && height >= height && x <= nodeX && x+width >= nodeX + nodeWidth && y<= nodeY && y + height >= nodeY + nodeHeight){
                    datas.push(node)
                }

            }
        })

        return datas
    }
}

