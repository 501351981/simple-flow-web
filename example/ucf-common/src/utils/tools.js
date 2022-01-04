const config = window.spasConfig || {};

const TokenKey = 'iot_access_token';
// const TokenKey = 'iot_access_token'

export function getItem(token = TokenKey) {
	return localStorage.getItem(token);
}

export function setItem(name = TokenKey, token) {
	localStorage.setItem(name, token);
}

export function removeItem(key) {
	localStorage.removeItem(key || TokenKey);
}

export function setCookie(name = TokenKey, value, hours) {
	let str = `${name}=${value}`;
	const domain = config.cookieDomain ? `;domain=${config.cookieDomain}` : '';
	if (hours) {
		const date = new Date();
		const ms = hours * 3600 * 1000;
		date.setTime(date.getTime() + ms);
		str = `${str}${domain};path=/;expires=${date.toGMTString()}`;
	} else {
		str += `${domain};path=/;expires=`;
	}
	document.cookie = str;
}
/*
 * cookie操作- get
 * */
export function getCookies() {
	const cookies = {};
	document.cookie.split(';').forEach((item) => {
		const pair = item.split('=');
		cookies[pair[0].trim()] = decodeURIComponent(pair[1]);
	});

	return cookies;
}
/*
 * cookie操作- get
 * */
export function getCookie(name = TokenKey) {
	// let cookies = getCookies();=
	const pattern = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`);
	const cookies = document.cookie.replace(pattern, '$1');

	return cookies || '';
}

export function removeCookie(name = TokenKey) {
	const date = new Date();
	date.setTime(date.getTime() - 10000);
	setCookie(name, '', -1);
}

export function getLanguage(fallbackLng = 'zh-CN') {
	let lang = fallbackLng;
	const query = window.location.href;
	// 先检查url参数，再检查是否有localStorage,没有的话检查浏览器默认语言，再没有使用默认
	const locale = query.match(/locale=([\w-]+)(&|$)/);
	if (locale && locale[1]) {
		lang = locale[1].replace('_', '-');
	} else if (localStorage.getItem('locale')) {
		lang = localStorage.getItem('locale');
	} else if (getCookie('iot_locale')) {
		lang = getCookie('iot_locale');
	} else {
		lang = navigator.language;
		switch (lang) {
			case 'zh':
				lang = 'zh-CN';
				break;
			case 'en':
				lang = 'en-US';
				break;
			default:
				break;
		}
	}
	if (!['zh-CN', 'zh-TW', 'en-US'].includes(lang)) {
		lang = fallbackLng;
	}

	return lang;
}

export function isQiankun() {
	return window.__POWERED_BY_QIANKUN__ || (window.spasConfig && window.spasConfig.cloud) || false;
}

export function getUuid() {
	const s = [];
	const hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4';
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = '-';
	const uuid = s.join('');

	return uuid;
}

export function throttle(fn, wait) {
	// let pre = Date.now();

	// return function (...args) {
	// 	const context = this;
	// 	const now = Date.now();
	// 	console.log(pre, now);
	// 	if (now - pre >= wait) {
	// 		fn.apply(context, args);
	// 		pre = Date.now();
	// 	}
	// };

	let timer;

	return function (...args) {
		if (timer) return;
		const context = this;
		timer = setTimeout(() => {
			fn.apply(context, args);
			timer = null;
		}, wait);
	};
}

export function debounce(func, wait, immediate = false) {
	let timer;

	return function (...args) {
		const context = this;
		if (timer) clearTimeout(timer);
		if (immediate) {
			const callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait);
			if (callNow) func.apply(context, args);
		} else {
			timer = setTimeout(function () {
				func.apply(context, args);
			}, wait);
		}
	};
}

export function formateLangage(str = '') {
	if (!str.startsWith('tr(')) return str;

	return str.slice(3, -1);
}

export function formatTimestamp(timestamp = new Date(), num = 0) {
	// 根据时间戳（毫秒）返回num天前/后的0点时间戳（毫秒）
	let rebackTime = 0;
	try {
		const year = new Date(timestamp).getFullYear();
		const month = new Date(timestamp).getMonth() + 1;
		const date = new Date(timestamp).getDate();
		const currentTime = new Date(`${year}/${month}/${date} 00:00:00`).getTime();
		rebackTime = currentTime + num * 24 * 60 * 60 * 1000;
	} catch (error) {
		console.log(error);
	}

	return rebackTime;
}

export function toFixed(num = 0, s) {
	// 处理js精度丢失问题
	const times = 10 ** s;
	let des = num * times + 0.5;
	des = parseInt(des, 10) / times;

	return `${des}`;
}
