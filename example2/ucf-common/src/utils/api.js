/*
 * @Author: your name
 * @Date: 2021-05-25 16:23:04
 * @LastEditTime: 2021-05-26 09:37:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \iot-cube-web\ucf-common\src\utils\api.js
 */

const isDev = process.env.NODE_ENV === 'development';
const userPrefix = isDev ? '/iotcube/user' : '/iotcube';

const isQianKun = window.__POWERED_BY_QIANKUN__ || (window.appConfig && window.appConfig.cloud) || false;
const permitService = isQianKun ? 'authn' : 'permit';

export default {
	// 多语
	getResources: 'GET /locale/api/v2/resource/lang/:lang', // 获取网站的语料资源
	getLangOptions: 'GET /locale/api/v2/language', // 获取支持的语种列表
	// 设备运行状态
	/* 设备 */
	getDeviceList: 'GET /iot-device-state/api/v1/device', // 获取设备列表
	createDevice: 'POST /iot-device-state/api/v1/device', // 新增设备
	modifyDevice: 'PUT /iot-device-state/api/v1/device/:id', // 更新设备
	deleteDevice: 'DELETE /iot-device-state/api/v1/device/:id', // 删除设备
	/* 设备属性 */
	getDeviceAttrList: 'GET /iot-device-state/api/v1/device/property', // 获取设备属性列表
	createDeviceAttr: 'POST /iot-device-state/api/v1/device/:deviceId/property', // 新增设备属性
	modifyDeviceAttr: 'PUT /iot-device-state/api/v1/device/:deviceId/property/:id', // 更新设备属性
	deleteDeviceAttr: 'DELETE /iot-device-state/api/v1/device/:deviceId/property/:id', // 删除设备属性
	/* 设备组 */
	getDeviceGroupList: 'GET /iot-device-state/api/v1/deviceGroup', // 获取设备组列表
	createDeviceGroup: 'POST /iot-device-state/api/v1/deviceGroup', // 新增设备组
	modifyDeviceGroup: 'PUT /iot-device-state/api/v1/deviceGroup/:id', // 更新设备组
	deleteDeviceGroup: 'DELETE /iot-device-state/api/v1/deviceGroup/:id', // 删除设备组
	bindDevice: 'POST /iot-device-state/api/v1/deviceGroup/:id/binding', // 绑定设备
	unbindDevice: 'POST /iot-device-state/api/v1/deviceGroup/:id/unbinding', // 解绑设备
	getPermissionGrouping: `GET /${permitService}/api/v1/current/grouptree`, // 过去节点列表
	/* 状态统计 */
	getDeviceState: 'GET /iot-device-state/api/v1/deviceState', // 获取设备运行状态
	getDeviceStatistics: 'GET /iot-device-state/api/v1/device/stateStatistics', // 获取设备状态统计
	getDeviceRunlog: 'GET /iot-device-state/api/v1/device/:deviceId/runlog', // 获取设备运行日志
	getDeviceRunlogStatus: 'GET /iot-device-state/api/v1/device/:deviceId/stateDetail', // 获取设备运行状态概览数据

	// 边缘端设备状态服务
	getDeviceStateHistory: 'GET /device-state-edge/api/v1/state/:deviceId', // 查询设备状态历史记录
	getDeviceStateOverview: 'GET /device-state-edge/api/v1/state/:deviceId/overview', // 查询设备状态概览
	editDeviceStateRule: 'PUT /core-metadata/api/v1/device/:deviceId/state', // 编辑设备状态规则
	getDeviceStateRule: 'GET /core-metadata/api/v1/device/:deviceId/state', // 查询设备状态规则
	getDevicePropsById: 'GET /core-metadata/api/v1/device/:deviceId', // 根据设备ID获取设备

	/* 通道管理 */
	getChannels: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/channel',
	getChannel: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/channel/id/:id',
	addChannel: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/channel',
	delChannel: 'DELETE /edgemgr/mgr/iot-edge-metadata/api/v1/channel/id/:id',
	editChannel: 'PUT /edgemgr/mgr/iot-edge-metadata/api/v1/channel',
	getAllDrivers: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceservice',
	getDriver: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceservice/:id',

	/* 设备模型管理 */
	getDeviceProfiles: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile', // 获取所有模板(复杂接口)
	getProfilesSimple: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/simple', // 获取所有模板简单接口
	addProfile: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile', // 增加模板
	deleteProfile: 'DELETE /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/id/:id', // 删除模板
	editProfile: 'PUT /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile', // 修改模板
	getProfileDetailById: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/:id', // 查询模板详情
	getProfileDetailByName: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/name/:name', // 根据名字获取模板
	getProfileCategorys: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/category', // 获取模板分类
	getProfileByCategory: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/category/:category', // 根据分类获取模板
	uploadProfile: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/upLoadExcel/:profileName', // 导入模板
	downloadProfile: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/downLoadExcel/:profileName ', // 导出模板
	getDeviceProfileSchema: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/schema', // 查看模板 schema
	checkProfileNameExist: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/table/:table/name/:name', // 检测 form 名称是否重复
	addProfileCategory: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/category', // 新增模板分类
	deleteProfileCategory: 'DELETE /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/category/:id', // 删除模板分类

	/* 边缘终端-设备管理 */
	getDevices: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/device/simple',
	getDevicesCategory: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/device/category',
	addDevice: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/device',
	editDevice: 'PUT /edgemgr/mgr/iot-edge-metadata/api/v1/device',
	editDeviceAndProfile: 'PUT /edgemgr/mgr/iot-edge-metadata/api/v1/deviceAndProfile',
	deviceAndProfile: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/deviceAndProfile',
	deleteDeviceEdge: 'DELETE /edgemgr/mgr/iot-edge-metadata/api/v1/device/id/:deviceid',
	getDeviceById: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/device/:id',
	getChannelByName: 'GET /edgemgr/mgr/iot-edge-metadata/channel/name/:name',
	getObjectModels: 'GET 、imp-dfm-eqp-server/api/v1/dfm/eqp/objects/listObject',
	getObjectProps: 'GET /imp-dfm-eqp-server/api/v1/dfm/eqp/objects/listObjectProperties',
	updatePropertiesTag: 'POST /imp-dfm-eqp-server/api/v1/dfm/eqp/objects/updatePropertiesTag',

	checkName: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/table/:table/name/:name',
	getProfileCategoryAll: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/deviceprofile/category/tree',
	addDeviceCategory: 'POST /edgemgr/mgr/iot-edge-metadata/api/v1/device/category',
	delDeviceCategory: 'DELETE /edgemgr/mgr/iot-edge-metadata/api/v1/device/category/:id',

	// 北向导出
	getAllReg: 'GET /export-client/api/v1/registration',
	getRegList: 'GET /export-client/api/v1/registration/reference/:type',
	getRegByID: 'GET /export-client/api/v1/registration/:id export-client',
	addReg: 'POST /export-client/api/v1/registration export-client',
	updateReg: 'PUT /export-client/api/v1/registration export-client',
	delRegById: 'DELETE /export-client/api/v1/registration/id/:id export-client',

	// 通用查询个数接口
	getCount: 'GET /edgemgr/mgr/iot-edge-metadata/api/v1/table/:table/count',

	/*
	 * 用户管理
	 * */
	getUserPagedList: 'GET  /edgemgr/mgr/user/api/v1/user',
	getUserCount: 'GET  /edgemgr/mgr/user/api/v1/table/user/count',
	getUserById: 'GET  /edgemgr/mgr/user/api/v1/user/:id',
	delUser: 'DELETE  /edgemgr/mgr/user/api/v1/user/:id',
	addUser: 'POST  /edgemgr/mgr/user/api/v1/user',
	editUser: 'PUT  /edgemgr/mgr/user/api/v1/user/:id',
	importUser: 'POST /edgemgr/mgr/user/api/v1/user/import',

	// 能源接口
	addWaterQuota: 'POST /energy/api/v1/water/quota',
	editWaterQuota: 'PUT /energy/api/v1/water/quota',
	getWaterQuota: 'GET /energy/api/v1/water/quota',
	addPowerQuota: 'POST /energy/api/v1/power/quota',
	editPowerQuota: 'PUT /energy/api/v1/power/quota',
	getPowerQuota: 'GET /energy/api/v1/power/quota',
	addGasQuota: 'POST /energy/api/v1/gas/quota',
	editGasQuota: 'PUT /energy/api/v1/gas/quota',
	getGasQuota: 'GET /energy/api/v1/gas/quota',
};
