import { url as utlTool } from 'aiot-design';
import { isQiankun } from './tools';

const urlMap = {
	'/spas-new/edge-profile-detail/': '/iot-cloud/portal/#/app/edges#profile-detail',
	'/spas-new/edge-device-detail/': '/iot-cloud/portal/#/app/edges#device-detail',
};

/*
 * 根据环境转换路由映射关系
 * url: 要转换的url，可带参数
 * urlParams：需要携带的路由参数，key: 要跳转的url上的参数名称；value：来源url上的参数。比如{"id":"project-id"},从一个带有project-id的url跳转到的url参数为id
 * */
export default function changeUrl(url, urlParams) {
	if (isQiankun()) {
		const urls = Object.keys(urlMap);
		let matchUrl = url;
		urls.forEach((item) => {
			const reg = new RegExp(item);
			reg.test(url) && (matchUrl = url.replace(reg, urlMap[item]));
		});
		const paramsArr = [];
		if (urlParams) {
			const paramCollect = utlTool.getParams();
			Object.keys(urlParams).forEach((item, index) => {
				paramsArr.push(`&${item}=${paramCollect[urlParams[item]]}`);
			});
		}
		const hasParams = url.includes('?');

		return matchUrl + (paramsArr.length ? `${hasParams ? '&' : '?'}${paramsArr.join('&')}` : '');
	}

	return url;
}
