/**
 *
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
import { shift_nums, special_keys } from './key';

const shortcut = {
	all_shortcuts: {}, // All the shortcuts are stored in this array
	add(shortcut_combination, callback, opt) {
		// 快捷键, 触发执行函数, 选项{type, propagate, target}
		// Provide a set of default options
		const default_options = {
			type: 'keydown',
			propagate: false,
			disable_in_input: false,
			target: document,
			keycode: false,
		};
		if (!opt) opt = default_options;
		else {
			for (const dfo in default_options) {
				if (typeof opt[dfo] === 'undefined')
					opt[dfo] = default_options[dfo];
			}
		}

		let ele = opt.target;
		if (typeof opt.target === 'string')
			ele = document.getElementById(opt.target);
		shortcut_combination = shortcut_combination.toLowerCase();

		// The function to be called at keypress
		const func = function (e) {
			// debugger
			// console.log(e)
			e = e || window.event;

			let code;
			let k;
			if (opt.disable_in_input) {
				// Don't enable shortcut keys in Input, Textarea fields
				let element;
				if (e.target) element = e.target;
				else if (e.srcElement) element = e.srcElement; // 兼容IE，IE中event对象有srcElement属性，但是没有target属性。
				if (element.nodeType === 3) element = element.parentNode; // nodeType=3代表文本节点

				if (
					element.nodeName === 'INPUT' ||
					element.nodeName === 'TEXTAREA'
				)
					return;
			}

			// Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			let character = String.fromCharCode(code).toLowerCase();

			if (code === 188) character = ','; // 英文,
			if (code === 190) character = '.'; // 英文.

			const keys = shortcut_combination.split('+');
			const modifiers = {
				shift: { wanted: false, pressed: false },
				ctrl: { wanted: false, pressed: false },
				alt: { wanted: false, pressed: false },
				meta: { wanted: false, pressed: false }, // Meta is Mac specific
			};

			if (e.ctrlKey) modifiers.ctrl.pressed = true;
			if (e.shiftKey) modifiers.shift.pressed = true;
			if (e.altKey) modifiers.alt.pressed = true;
			if (e.metaKey) modifiers.meta.pressed = true;
			// Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			let kp = 0;
			// console.log('opt',opt)
			for (let i = 0; (k = keys[i]), i < keys.length; i++) {
				// Modifiers
				// console.log('k=',k)
				if (k === 'ctrl' || k === 'control') {
					kp++;
					modifiers.ctrl.wanted = true;
				} else if (k === 'shift') {
					kp++;
					modifiers.shift.wanted = true;
				} else if (k === 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if (k === 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if (k.length > 1) {
					// If it is a special key
					// console.log('special_keys[k] === code',k,special_keys[k] ,code,)
					if (special_keys[k] === code) kp++;
				} else if (opt.keycode) {
					debugger
					if (opt.keycode === code) kp++;
				} else {
					// The special keys did not match
					if (character === k) kp++;
					else if (shift_nums[character] && e.shiftKey) {
						// Stupid Shift key bug created by using lowercase
						character = shift_nums[character];
						if (character === k) kp++;
					}
				}
			}
			// console.log(modifiers, kp, keys.length, 'modifiers');
			if (
				kp === keys.length &&
				modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
				modifiers.shift.pressed === modifiers.shift.wanted &&
				modifiers.alt.pressed === modifiers.alt.wanted &&
				modifiers.meta.pressed === modifiers.meta.wanted
			) {
				let inputs = [];
				if (opt.hasDefaultInput) {
					inputs = ele.getElementsByClassName('node-list-name-input');
				} else {
					inputs = ele.getElementsByTagName('input');
				}

				if (inputs.length) {
					return;
				}
				callback(e);

				if (!opt.propagate) {
					// IE 浏览器阻止冒泡写法
					e.cancelBubble = true;
					e.returnValue = false;

					// e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}

					return false;
				}
			}
		};
		this.all_shortcuts[shortcut_combination] = {
			callback: func,
			target: ele,
			event: opt.type,
		};
		// Attach the function with the event
		if (ele.addEventListener) ele.addEventListener(opt.type, func, false);
		else if (ele.attachEvent) ele.attachEvent(`on${opt.type}`, func);
		// IE 事件模型使用 attachEvent() 方法注册事件
		else ele[`on${opt.type}`] = func;
	},

	// Remove the shortcut - just specify the shortcut and I will remove the binding
	remove(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		const binding = this.all_shortcuts[shortcut_combination];
		delete this.all_shortcuts[shortcut_combination];
		if (!binding) return;
		const type = binding.event;
		const ele = binding.target;
		const { callback } = binding;

		if (ele.detachEvent) ele.detachEvent(`on${type}`, callback);
		else if (ele.removeEventListener)
			ele.removeEventListener(type, callback, false);
		else ele[`on${type}`] = false;
	},
};

export default shortcut;
