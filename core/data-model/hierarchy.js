import Node from "../node/index";
export function hierarchyMixin(DataModel){
    DataModel.prototype.moveToTop = function (data){
        if(!this.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行moveToTop操作")
            }
            return
        }
        if(data instanceof Node){
            let id = data.getId()
            for(let i = 0; i < this._nodesSortKey.length; i++){
                if(id === this._nodesSortKey[i]){
                    if(i === this._nodesSortKey.length - 1){
                        return
                    }
                    this._nodesSortKey.splice(i, 1)
                    this._nodesSortKey.push(id)

                    //操作dom
                    data.moveToTop()
                    break
                }
            }
        }
    }

    DataModel.prototype.moveToBottom = function (data){
        if(!this.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行moveToBottom操作")
            }
            return
        }
        if(data instanceof Node){
            let id = data.getId()
            for(let i = 0; i < this._nodesSortKey.length; i++){
                if(id === this._nodesSortKey[i]){
                    if(i === 0){
                        return
                    }

                    this._nodesSortKey.splice(i, 1)
                    this._nodesSortKey.unshift(id)
                    //操作dom
                    data.moveToBottom()
                    break
                }
            }
        }
    }

    DataModel.prototype.moveUp = function (data){
        if(!this.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行moveUp操作")
            }
            return
        }
        if(data instanceof Node){
            let id = data.getId()
            for(let i = 0; i < this._nodesSortKey.length; i++){
                if(id === this._nodesSortKey[i]){
                    if(i === this._nodesSortKey.length - 1){
                        return
                    }
                    let targetNode = this._nodes[this._nodesSortKey[i+1]]
                    this._nodesSortKey[i] = this._nodesSortKey[i+1]
                    this._nodesSortKey[i+1] = id

                    targetNode.insertBefore(data)
                    break
                }
            }
        }
    }

    DataModel.prototype.moveDown = function (data){
        if(!this.getEditable()){
            if(process.env.NODE_ENV === 'development'){
                console.warn("getEditable = false，不能进行moveToDown操作")
            }
            return
        }
        if(data instanceof Node){
            let id = data.getId()
            for(let i = 0; i < this._nodesSortKey.length; i++){
                if(id === this._nodesSortKey[i]){
                    if(i === 0){
                        return
                    }
                    let targetNode = this._nodes[this._nodesSortKey[i-1]]
                    this._nodesSortKey[i] = this._nodesSortKey[i-1]
                    this._nodesSortKey[i-1] = id

                    data.insertBefore(targetNode)
                    break
                }
            }
        }
    }
}
