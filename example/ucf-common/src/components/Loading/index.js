/*----------------------------------------------------------
名称：页面loading
简介：所有网络请求或耗时较长的，均应使用loading

-----------------------------------------------------------*/
import React, { Component } from 'react';
import PropTypes, { func } from 'prop-types';
import './index.less';

const propTypes = {
	show: PropTypes.bool, // 标题
};

const defaultProps = {
	show: false,
};

function Loading(props) {
	return (
		<div
			id="page-loading"
			style={{ display: props.show ? 'flex' : 'none' }}
		>
			<span className="loading-dot loading-dot-spin">
				<i className="loading-dot-item" />
				<i className="loading-dot-item" />
				<i className="loading-dot-item" />
				<i className="loading-dot-item" />
			</span>
		</div>
	);
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;
export default Loading;
