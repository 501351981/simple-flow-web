/**
 * App模块
 */

import React, { Component } from 'react';
import { connect } from 'mirrorx';
import SF from '../../../../core/index'
import FunctionNode from "./nodes/function";
import './index.less';
import '../../../../core/style/index.less'

import SelectionModel from "../../../../core/selection-model";
import HistoryManager from "../../../../core/history-manager";

console.log(SF)
// console.log(FunctionNode instanceof SF.Node)
class IndexView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.ref = React.createRef()
	}
	componentDidMount() {
		let dataModel = window.dataModel = new SF.DataModel()
		let historyManager = window.historyManager = new SF.HistoryManager(dataModel)
		let graphView = window.graphView = new SF.GraphView(dataModel, {
			graphView: {
				width:6000,
				height:6000,
				scale:{
					max:3
				}
			}
		})


		let json = {"v":"1.0.0","p":{"width":5000,"height":5000,"gridSize":20,"background":"#fff"},"a":{"init":true},"d":[{"type":"inject","id":"1aa6129ca0eb2042","p":{"displayName":"注入数据","position":{"x":295,"y":106},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[[],["49536505a4488892"]]},{"type":"function","id":"49536505a4488892","p":{"displayName":"注入数据","position":{"x":565,"y":117},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[["a2a0ae774c68190b"]]},{"type":"function","id":"a2a0ae774c68190b","p":{"displayName":"注入数据","position":{"x":589,"y":217},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[["cbe4c17ebc4b7c03"]]},{"type":"debug","id":"cbe4c17ebc4b7c03","p":{"displayName":"调试","position":{"x":911,"y":229},"width":150,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[]}]}

		graphView.registerNode('inject',{
			class: 'node-inject',
			align:'left',
			category: 'common',
			bgColor: '#a6bbcf',
			color:'#fff',
			defaults:{},
			icon: '/static/icons/node/inject.svg',
			inputs:0,
			outputs:2,
			width:150,
			height: 40
		})
		graphView.registerNode('function',FunctionNode)
		graphView.registerNode('debug',{
			align:'right',
			category: 'common',
			bgColor: '#87a980',
			color:'#fff',
			defaults:{},
			icon: '/static/icons/node/debug.svg',
			inputs:1,
			outputs:0,
			width:150,
			height: 40
		})
		dataModel.deserialize(json)
		graphView.addToDOM(this.ref.current)

		let node = window.node1 = new SF.Node({
			"type": "inject",
			"id": "7d752529.5566",
			"p": {
				"displayName": "注入数据",
				"position": {
					"x": 45,
					"y": 65
				},
				"width":200,
				"height":40
			},
			"a": {
				"payload": "",
				"payloadType": "date",
				"repeat": "",
				"crontab": "",
				"once": false,
				"onceDelay": 0.1
			},
			"wires": [
			]
		})


		// let sm = new SelectionModel(dataModel,graphView)
		// setTimeout(()=>{
		// 	// sm.appendSelection([dataModel.getDataById('7d752529.629a5c-0-f3d1c6e0.2de248'), dataModel.getDataById('7d752529.629a5c-0-ca55d753.5e6d27')])
		// 	// console.log(sm.contains(dataModel.getDataById('7d752529.629a5c-0-f3d1c6e0.2de248')))
		// 	// sm.each(function (item, index) {
		// 	// 	console.log('each', item, index)
		// 	// })
		// 	// sm.selectAll()
		// 	setTimeout(()=>{
		// 		// sm.clearSelection()
		// 		console.log(sm.contains(dataModel.getDataById('7d752529.629a5c-0-f3d1c6e0.2de248')))
		// 	},1500)
		// },1500)
		// console.log(sm)
		// dataModel.add(node)

		// setInterval(()=>{
		// 	console.log(dataModel.serialize())
		// },3000)
		// setTimeout(()=>{
		// 	graphView.setHeight(500)
		// 	graphView.setGridSize(10)
		// 	graphView.setBackground('#0f0f0f')
		// },1000)
		// console.log(node.getAttr('payloadType'))
		// console.log(node.getAttr('payloadType2'))
		// node.a({
		// 	payloadType2:666
		// })
		// console.log(node.a('payloadType2'))
		// console.log(node.draw())
		//
		// let node2 = new SF.Node({
		// 	"type": "inject",
		// 	"id": "666.777",
		// 	"p": {
		// 		"displayName": "注入数据",
		// 		"position": {
		// 			"x": 340,
		// 			"y": 160
		// 		},
		// 		"width":200,
		// 		"height":80
		// 	},
		// 	"a": {
		// 		"payload": "",
		// 		"payloadType": "date",
		// 		"repeat": "",
		// 		"crontab": "",
		// 		"once": false,
		// 		"onceDelay": 0.1
		// 	},
		// 	"wires": [
		// 		[
		// 			"f3d1c6e0.2de248",
		// 			"ca55d753.5e6d28"
		// 		]
		// 	]
		// },dataModel)
		//
		// $('.sf-nodes')[0].append(node.draw()[0])
		// $('.sf-nodes')[0].append(node2.draw()[0])
		//
		//
		// setTimeout(()=>{
		// 	node2.setWidth(300)
		// 	node2.setHeight(60)
		// 	node2.setPosition(500,250)
		// 	node2.setId('gsdff.232')
		// 	node2.setDisplayName('修改后的名字')
		// },3000)
	}

	scale = (type) =>{
		let scale = graphView.getScale()
		switch(type){
			case 'add':
				scale < 2 && graphView.setScale(scale + 0.1)
				break;
			case 'reduce':
				scale > 0.6 && graphView.setScale(scale - 0.1)
				break
			default:
				graphView.setScale(1)
				break
		}
	}

	render() {
		return (
			<div ref={this.ref} className="template-wrapper">
				<div className={'scale-btns'}>
					<span onClick={this.scale.bind(this, 'reduce')}>缩小</span>
					<span  onClick={this.scale.bind(this)}>重置</span>
					<span onClick={this.scale.bind(this, 'add')}>放大</span>
				</div>
			</div>
		);
	}
}

IndexView.displayName = 'IndexView';
export default connect((state) => state.app)(IndexView);
