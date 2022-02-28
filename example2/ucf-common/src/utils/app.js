/*
 * @Author: your name
 * @Date: 2020-12-03 13:54:18
 * @LastEditTime: 2020-12-18 10:16:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \iot-cloud-web\ucf-common\src\utils\app.js
 */
import { request, permissionUtil, lang, url as urlTool } from 'aiot-design';
import { message } from 'antd';
import mirror from 'mirrorx';
import _ from 'lodash';
import { getLanguage, isQiankun } from './tools';
import api from './api';

/*
 * 项目初始化：初始化多语和网络请求等
 * projectCode:多语项目编码
 * locales: 本地多语资源
 * breadcrumbInfo: 详情页等子页面的面包屑字典信息
 * setGlobalState： 父子状态通信设定状态方法
 * onGlobalStateChange： 监听到状态变化的相应响应事件
 * needPermission：是否需要权限验证，默认为false
 * */

let locationChangeHook;
let setGlobalStateFuc;

async function init({
	projectCode = ['common'],
	locales = {},
	breadcrumbInfo = {},
	setGlobalState,
	needPermission = false,
}) {
    window.setGlobalState = setGlobalState;
	initRequest();
	initHook({ breadcrumbInfo, setGlobalState });
	const baseName = initBaseName();
	projectCode.length && (await initLangLocale(projectCode, locales));
	const permission = needPermission ? await initPermission() : {};

	return { baseName, permission };
}

function initBaseName() {
	let baseName = '/';
	if (isQiankun()) {
		const router = window.location.hash.match(/(\/.*?\/.*?)(\/|\?|$)/);
		if (router && router[1]) {
			baseName = router[1];
		}
	}

	return baseName;
}

function initHook({ breadcrumbInfo, setGlobalState }) {
	setGlobalStateFuc = setGlobalState;
	setGlobalState &&
		setGlobalState({
			breadcrumbName: breadcrumbInfo || '',
		});
	// locationChangeHook = mirror.hook((action) => {
	// 	// console.log(action, getState(), 'mirrox-action')
	// 	if (action.type === '@@router/LOCATION_CHANGE') {
	// 		setGlobalState &&
	// 			setGlobalState({
	// 				breadcrumbName:
	// 					breadcrumbInfo[action.payload.pathname] || '',
	// 			});
	// 	}
	// });
}

export const requestDefaultOptions = {
	withCredentials: true,
	baseURL: process.env.API_BASE_URL || '',
	onFail: (err) => {
		try {
			console.error('onFail', err);
			if (err.response) {
				if (err.response.status && err.response.status === 401) {
					// 公有云
					if (isQiankun()) {
						const href = window.appConfig.loginUrl.replace(
							'${href}',
							encodeURIComponent(encodeURIComponent(window.location.href))
						);
						window.location.href = href;

						return;
					}
				}
				const { msg, errorCode } = err.response.data || {};
				const errMsg =
					errorCode && window.t && window.t(errorCode) !== errorCode ? window.t(errorCode) : msg || errorCode;
				const url = _.get(err, 'response.config.url');
				const statusText = _.get(err, 'response.statusText');

				return message.error({
					content: `${errMsg || statusText}，url=${url}`,
					className: 'aiot-design-message-error',
				});
			}
			if (err.data) {
				const { code, data, msg, errorCode } = err.data;
				if (code === -5) {
					if (isQiankun()) {
						const href = window.spasConfig.loginUrlCloud.replace(
							'${href}',
							encodeURIComponent(encodeURIComponent(window.location.href))
						);
						window.location.href = href;

						return;
					}

					const parent = window.top;
					if (parent && parent !== window) {
						parent.postMessage(
							JSON.stringify({
								needLogin: true,
								redirect: data,
							}),
							'*'
						);
					}

					return message.error({
						content: '登录过期，请重新登录',
						className: 'aiot-design-message-error',
					});
				}
				if (code === 401) {
					if (isQiankun()) {
						const href = window.spasConfig.loginUrlCloud.replace(
							'${href}',
							encodeURIComponent(encodeURIComponent(window.location.href))
						);

						return (window.location.href = href);
					}

					const msg =
						errorCode && window.t && window.t(errorCode) !== errorCode
							? window.t(errorCode)
							: msg || errorCode;

					return message.error({
						content: msg || '未登录',
						className: 'aiot-design-message-error',
					});
				}
				const errMsg =
					errorCode && window.t && window.t(errorCode) !== errorCode ? window.t(errorCode) : msg || errorCode;

				return message.error({
					content: errMsg || '接口请求失败',
					className: 'aiot-design-message-error',
				});
			}
		} catch (e) {
			console.error(e, 'request');
		}
	},
};

export function initRequest() {
	// 初始化网络请求
	request.setDefaultOptions(requestDefaultOptions);
}

async function initLangLocale(projectCode, locales) {
	const locale = getLanguage('zh-CN');
	await lang.init(projectCode, locale, locales);
}

async function initPermission() {
	try {
		const [isAdmin = false, menuRes = [], groupRes = []] = await Promise.all([
			request(api.isTernantAdmin),
			request(api.getAccessMemu),
			request(api.getOrgsTree),
		]);

		return {
			isAdmin,
			menus: permissionUtil.openAccesseMenu(menuRes || []),
			groups: permissionUtil.openAccesseGroup(groupRes || []),
		};
	} catch (e) {
		return {
			isAdmin: false,
			menus: [],
			groups: [],
		};
	}
}

function destroy() {
	setGlobalStateFuc && setGlobalStateFuc({});
	locationChangeHook && locationChangeHook();
}

export default {
	init,
	destroy,
};
