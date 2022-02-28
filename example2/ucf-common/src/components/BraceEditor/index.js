import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/ext/searchbox';
// import { Search } from 'ace-builds/src-noconflict/ext-searchbox';
import 'brace/theme/kuroir';
import 'brace/ext/language_tools';
// 引入顺序需要注意

const propTypes = {
	onChange: PropTypes.func,
	className: PropTypes.string,
	defaultFunction: PropTypes.string,
	content: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,
	readOnly: PropTypes.bool,
	name: PropTypes.string,
};

const defaultProps = {
	onChange: () => {},
	defaultFunction: '',
	content: undefined,
	className: 'ace-editor',
	width: 500,
	height: 500,
	readOnly: false,
	name: 'ace-editor',
};

class BraceEditor extends Component {
	constructor(props) {
		super();
		this.state = {
			content: props.content,
		};
		this.aceRef = React.createRef();
	}

	// componentDidMount() {
	// 	console.log(this.aceRef.current.editor);
	// 	Search && Search(this.aceRef.current.editor, false);
	// 	const currentAceItem = (this.aceRef.current.editor && this.aceRef.current.editor.searchBox) || {};
	// 	currentAceItem.hide();
	// 	currentAceItem.searchInput.placeholder = '搜索';
	// }

	componentWillReceiveProps(nextProps) {
		const { content } = this.props;
		if (nextProps.content !== content) {
			this.setState({
				content: nextProps.content,
			});
		}
	}

	onValueChange = (value) => {
		const { onChange } = this.props;
		onChange(value);
	};

	render() {
		const { content } = this.state;
		const { className, width, height, readOnly, name, defaultFunction } = this.props;

		return (
			<AceEditor
				ref={this.aceRef}
				name={name}
				width={width}
				height={height}
				className={className}
				defaultValue={defaultFunction}
				value={content}
				mode="javascript"
				theme="kuroir"
				// 自动换行
				wrapEnabled
				onChange={this.onValueChange}
				highlightActiveLin
				showGutter
				readOnly={readOnly}
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					useWorker: false,
					// enableSnippets: false,
				}}
			/>
		);
	}
}

BraceEditor.propTypes = propTypes;
BraceEditor.defaultProps = defaultProps;

export default BraceEditor;
