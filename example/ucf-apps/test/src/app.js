/**
 * 入口、导入组件样式、渲染
 */

import React from 'react';
import ReactDOM from 'react-dom';
import mirror, { render } from 'mirrorx';
import app from 'utils/app';


import App from './index';
import model from './model';

import './app.less';

// 数据和组件UI关联、绑定
mirror.model(model);

export const bootstrap = async () => {
	// do something
};

export function mount(props = {}) {
	const { container } = props;
	render(
		<App />,
		container ? container.querySelector('#app') : document.getElementById('app')
	);
}

export function unmount(props) {
	const { container } = props;
	app.destroy();
	ReactDOM.unmountComponentAtNode(container ? container.querySelector('#app') : document.getElementById('app'));
}

if (!window.__POWERED_BY_QIANKUN__) {
	mount();
}
