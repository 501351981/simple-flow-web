import React, {useRef, useEffect} from 'react';
import 'simple-flow/core/style/index.less'
import SF from 'simple-flow/core/index'
import FunctionNode from './nodes/function'

import './SimpleFlow.less'

function SimpleFlow(){
    let ref = useRef()
    useEffect(function (){
        let dataModel = new SF.DataModel()
        let historyManager = new SF.HistoryManager(dataModel)
        let graphView = new SF.GraphView(dataModel, {
            graphView: {
                width:6000,
                height:6000,
                scale:{
                    max:3
                }
            }
        })

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

        let json = {"v":"1.0.0","p":{"width":5000,"height":5000,"gridSize":20,"background":"#fff"},"a":{"init":true},"d":[{"type":"inject","id":"1aa6129ca0eb2042","p":{"displayName":"注入数据","position":{"x":295,"y":106},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[[],["49536505a4488892"]]},{"type":"function","id":"49536505a4488892","p":{"displayName":"注入数据","position":{"x":565,"y":117},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[["a2a0ae774c68190b"]]},{"type":"function","id":"a2a0ae774c68190b","p":{"displayName":"注入数据","position":{"x":589,"y":217},"width":200,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[["cbe4c17ebc4b7c03"]]},{"type":"debug","id":"cbe4c17ebc4b7c03","p":{"displayName":"调试","position":{"x":911,"y":229},"width":150,"height":40},"a":{"payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1},"wires":[]}]}

        dataModel.deserialize(json)
        graphView.addToDOM(ref.current)
    },[])

    return <div ref={ref} className={'sf-wrapper'}></div>
}

export default SimpleFlow