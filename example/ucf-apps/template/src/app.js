/**
 * 入口、导入组件样式、渲染
 */

import React from 'react';
import ReactDOM from 'react-dom';
import mirror, { render } from 'mirrorx';
import app from 'utils/app';
import I18nProvider from 'components/I18nProvider';

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
	app.init({ projectCode: ['common'] }).then(() => {
		render(
			<I18nProvider>
				<App />
			</I18nProvider>,
			container ? container.querySelector('#app') : document.getElementById('app')
		);
	});
}

export function unmount(props) {
	const { container } = props;
	app.destroy();
	ReactDOM.unmountComponentAtNode(container ? container.querySelector('#app') : document.getElementById('app'));
}

if (!window.__POWERED_BY_QIANKUN__) {
	mount();
}
