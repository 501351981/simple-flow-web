/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-07-21 14:00:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-22 16:32:07
 */

const k3sDevelop = 'http://iot-develop.10.16.226.192.xip.io';
const k3sTest = 'http://iot-test.10.16.226.192.xip.io';
const serverUrl = k3sDevelop;
const iotcloud = 'https://iot.yyuap.com';
const mockUrl = 'http://10.16.224.213:18384/mock/89';
const deviceUrl = 'http://10.16.8.98:8990';
const serverYapiUrl = 'http://10.16.224.213:18384/mock/89';

function formatUcfProxy(proxy) {
	const ucfProxy = [];
	for (const route in proxy) {
		const base = {
			enable: true,
			// headers: {
			//   Referer: refererUrl,
			//   "Cookie": "iot_access_token=Bearer+eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDgxOTc2MjIsImlhdCI6MTYwODE5MDQyMiwibmJmIjoxNjA4MTkwNDIyLCJzdWIiOiI2ZDI0ZjViMi1iYTZiLTQyYTYtYjc3NS04ZDdmMjA2ZmM3ZmFAd2ViIn0.mmUJDrv8Q-IvebQVhrcy-D9-i0nfJ6lTVh2pxS5egw14eDXd3X32wkegTbMmF2KWFLEUo19mVgFaTNq1nuUKAA"
			// },
			router: [route],
		};
		if (typeof proxy[route] === 'string') {
			ucfProxy.push({
				...base,
				url: proxy[route],
			});
		} else {
			ucfProxy.push({
				...base,
				...proxy[route],
			});
		}
	}

	return ucfProxy;
}

const proxy = {
	// 简单写法
	'/locale': k3sTest,
	'/reader/api/v1': {
		pathRewrite: {
			'^/reader/api/v1': '/reader/api/v1',
		},
		url: serverUrl,
	},
	'/user': k3sTest,
	'/oss': serverUrl,
	'/permit': serverUrl,
	'/authn': iotcloud,
	'/iot-device-state': {
		pathRewrite: {
			'^/iot-device-state': '/spas-new/iot-device-state',
		},
		url: serverUrl,
	},
	'/edgemgr': iotcloud,
	'/energy': iotcloud,
	'/export-client': {
		pathRewrite: {
			'^/export-client': '/iotweb/export-client',
		},
		url: k3sTest,
	},
	'/device-state-edge/api/v1': {
		pathRewrite: {
			'^/device-state-edge/api/v1': '/spas-new/device-state-edge/api/v1',
		},
		url: k3sDevelop,
	},
	// '/iot-device-state-edge/api/v1': {
	// 	pathRewrite: {
	// 		'^/iot-device-state-edge/api/v1': '/spas-new/iot-device-state-edge/api/v1',
	// 	},
	// 	url: k3sDevelop,
	// },
	// '/device-state-edge/api/v1': {
	// 	pathRewrite: {
	// 		'^/device-state-edge/api/v1': '/device-state/api/v1',
	// 	},
	// 	url: serverYapiUrl,
	// },
	// '/core-metadata/api/v1': {
	// 	pathRewrite: {
	// 		'^/core-metadata/api/v1': '/spas-new/core-metadata/api/v1',
	// 	},
	// 	url: k3sDevelop,
	// },
	'/core-metadata/api/v1': k3sTest,
};

module.exports = formatUcfProxy(proxy);
