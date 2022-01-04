/**
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md
 * 语雀全新详细文档请访问 https://www.yuque.com/ucf-web/book/zfy8x1
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const proxy = require('./ucf-config/ucf.config.proxy');
const alias = require('./ucf-config/ucf.config.alias');

const context = 'spas-new';

function getProjectName(argv) {
	let projectName = '';
	for (let i = 3; i < argv.length; i++) {
		const config = argv[i];
		if (config.startsWith('--project=')) {
			projectName = config.substr(10);
			projectName = projectName.split(',');

			return projectName;
		}
	}

	return projectName;
}

module.exports = (env, argv) => {
	const isBuild = argv[0] === 'build';
	const project = getProjectName(process.argv);

	return {
		context,
		// 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
		// bootList: true,
		// 启动这两个模块，启动调试、构建
		bootList: project || true,
		// 代理的配置
		proxy,
		// 展开打包后的资源文件，包含图片、字体图标相关
		res_extra: true,
		// 构建资源的时候产出sourceMap，调试服务不会生效
		open_source_map: false,
		// CSS loader 控制选项
		css: {
			modules: false,
		},
		// 全局环境变量
		global_env: {
			__MODE__: JSON.stringify(env),
			GROBAL_HTTP_CTX: isBuild ? JSON.stringify('/ucf-webapp') : JSON.stringify('/mock/936'),
			'process.env.NODE_ENV': JSON.stringify(env),
			'process.env.RANDOM': Math.random(),
			'process.env.CONFIG_PATH':
				env === 'development' ? JSON.stringify(`${context ? `/${context}` : ''}/config`) : JSON.stringify('..'),
			'process.env.STATIC_HTTP_PATH':
				env === 'development'
					? JSON.stringify(`${context ? `/${context}` : ''}/static`)
					: JSON.stringify('../static'),
			'process.env.API_BASE_URL': env === 'development' ? JSON.stringify('') : JSON.stringify(''),
		},
		static: 'ucf-common/src',
		// 别名配置
		alias,
		// 构建排除指定包
		externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
			'prop-types': 'PropTypes',
		},
		// 加载器Loader
		loader: [
			{
				test: /\.scss?$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
		// 调试服务需要运行的插件
		devPlugins: [],
		// 构建服务需要运行的插件
		buildPlugins: [
			new CopyWebpackPlugin([
				{
					from: 'ucf-common/src/static/',
					to: 'static',
				},
				{
					from: 'ucf-common/src/config',
					to: '.',
				},
			]),
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						// drop_console: true,
						// drop_debugger: true,
					},
				},
			}),
		],
		babel_presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						chrome: '58',
						ie: '11',
						firefox: '45',
					},
				},
				'babel-preset-env',
			],
		],
	};
};
