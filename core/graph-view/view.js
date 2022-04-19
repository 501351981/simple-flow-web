import $ from 'jquery'
export function viewMixin(GraphView) {
    GraphView.prototype.initView = function () {
        let view = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this._outerLayer = $(view)
            .attr('id','sf-outer-view')
            .attr('width',this._width * this._scale)
            .attr('height',this._height * this._scale)
            .css("cursor","crosshair")
            .css("touch-action","none")

        this._eventLayer = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-event-layer')
            .attr('transform',`scale(${this._scale})`)
            .attr('tabindex',0)

        this._backgroundLayer = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect'))
            .attr('class','sf-background')
            .attr('fill', this._background )
            .attr('width',this._width)
            .attr('height',this._height)

        this._gridLayer =  $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-grid')
        this.updateGrid()

        this._linkLayer =  $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-links')
        this._tempLinkLayer =  $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-temp-links')
        this._nodeLayer =  $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-nodes')

        this._selectLayer =  $(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
            .attr('class','sf-select')

        this._eventLayer.append(this._backgroundLayer)
        this._eventLayer.append(this._gridLayer)
        this._eventLayer.append(this._linkLayer)
        this._eventLayer.append(this._tempLinkLayer)
        this._eventLayer.append(this._nodeLayer)
        this._eventLayer.append(this._selectLayer)

        this._outerLayer.append(this._eventLayer)
        return this
    }

    GraphView.prototype.updateGrid = function(){
        this._gridLayer.empty()
        for(let i=0;i<this._width;i+=this._gridSize){
            let line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
                .attr({
                    class:'sf-grid-v',
                    x1: i,
                    y1: 0,
                    x2: i,
                    y2: this._height,
                    stroke: '#eee',
                    'stroke-width': 1
                })
            this._gridLayer.append(line)
        }
        for(let i=0;i<this._height;i+=this._gridSize){
            let line = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'))
                .attr({
                    class:'sf-grid-h',
                    x1: 0,
                    y1: i,
                    x2: this._width,
                    y2: i,
                    stroke: '#eee',
                    'stroke-width': 1
                })
            this._gridLayer.append(line)
        }
        return this
    }

    GraphView.prototype.addToDom = function(parentNode){
        this._parentNode = $(parentNode)
        this._parentNode.append(this._outerLayer)
        return this
    }

    GraphView.prototype.getOuterLayer = function(){
        return this._outerLayer
    }
    GraphView.prototype.getEventLayer = function(){
        return this._eventLayer
    }
    GraphView.prototype.getBackgroundLayer = function(){
        return this._backgroundLayer
    }
    GraphView.prototype.getGridLayer = function(){
        return this._gridLayer
    }
    GraphView.prototype.getLinkLayer = function(){
        return this._linkLayer
    }
    GraphView.prototype.getNodeLayer = function(){
        return this._nodeLayer
    }

    GraphView.prototype.setWidth = function (width) {
        this._width = width
        this.getOuterLayer().attr('width',this._width * this._scale)
        this.getBackgroundLayer().attr('width',this._width)
        this.updateGrid()
        return this
    }

    GraphView.prototype.getWidth = function () {
        return this._width
    }

    GraphView.prototype.setHeight = function (height) {
        this._height = height
        this.getOuterLayer().attr('height',this._height * this._scale)
        this.getBackgroundLayer().attr('height',this._height)
        this.updateGrid()
        return this
    }
    GraphView.prototype.getHeight = function () {
        return this._height
    }

    GraphView.prototype.setGridSize = function (gridSize) {
        this._gridSize = gridSize
        this.updateGrid()
        return this
    }

    GraphView.prototype.getGridSize = function () {
        return this._gridSize
    }

    GraphView.prototype.setBackground = function (background) {
        this._background = background
        this.getBackgroundLayer().attr('fill', this._background )
        return this
    }

    GraphView.prototype.getBackground = function () {
        return this._background
    }

    GraphView.prototype.getScale = function () {
        return this._scale
    }

    GraphView.prototype.setScale = function (scale) {
        this._scale = scale
        this._eventLayer.attr('transform',`scale(${this._scale})`)
        this._outerLayer.attr('width',this._width * this._scale)
        this._outerLayer.attr('height',this._height * this._scale)
        return this
    }

    GraphView.prototype.zoomIn = function () {
        //放大
        let scale = this._scale
        const {max, step} = this._config.graphView.scale
        if(scale + step <= max){
            this.setScale(scale + step)
        }
        return this
    }

    GraphView.prototype.zoomOut = function () {
        //放大
        let scale = this._scale
        const {min, step} = this._config.graphView.scale
        if(scale - step >= min){
            this.setScale(scale - step)
        }
        return this
    }
}
