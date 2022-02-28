import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import {
	NoData,
	ConfigProvider as AiotConfigProvider,
	message,
	context,
} from 'aiot-design';

// antd 所需文件，不需要删除
import antd_zh_CN from 'antd/es/locale/zh_CN';
import antd_zh_TW from 'antd/es/locale/zh_TW';
import antd_en_US from 'antd/es/locale/en_US';

import { requestDefaultOptions } from '../../utils/app';

import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';

// antd 相关多语
const antdLocales = {
	'zh-CN': antd_zh_CN,
	'zh-TW': antd_zh_TW,
	'en-US': antd_en_US,
};

ConfigProvider.config({
	rootPrefixCls: 'aiot-cube',
	prefixCls: 'aiot-cube',
});

const optionsOfRequest = requestDefaultOptions;

export default function ({
	children,
	menus = [],
	groups = [],
	isAdmin = false,
}) {
	const { i18n } = window;
	const lang = i18n ? i18n.getLang() : 'zh-CN';
	const locale =
		antdLocales[lang] ||
		require(`antd/es/locale/${lang.replace(/-|_/gi, '_')}`);
	const htmlDom = document.getElementsByTagName('html')[0];
	htmlDom.setAttribute('lang', lang);
	const GlobalContext = context();

	return (
		// renderEmpty  重写antd的Empty组件，改成用友的图标
		<ConfigProvider
			autoInsertSpaceInButton={false}
			renderEmpty={() => <NoData lang={lang} />}
			locale={locale}
			prefixCls="aiot-cube"
		>
			<AiotConfigProvider
				autoInsertSpaceInButton={false}
				locale={
					require(`aiot-design/lib/components/locale/${lang.replace(
						/-|_/gi,
						'_'
					)}`).default
				}
				lang={lang}
				defaultOptionsOfRequest={optionsOfRequest}
			>
				<GlobalContext.Provider
					value={{
						menus,
						groups,
						isAdmin,
					}}
				>
					{children}
				</GlobalContext.Provider>
			</AiotConfigProvider>
		</ConfigProvider>
	);
}
