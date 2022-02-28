/**
 * App模块
 */

import React, { Component } from 'react';
import { connect } from 'mirrorx';

import './index.less';

class IndexView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="template-wrapper">
				<span>asdasd</span>
			</div>
		);
	}
}

IndexView.displayName = 'IndexView';
export default connect((state) => state.app)(IndexView);
