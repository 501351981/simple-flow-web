const key = {
	shift: '16',
	ctrl: '17',
	alt: '18',
	meta: '91',
	a: '65',
	b: '66',
	c: '67',
	d: '68',
	e: '69',
	f: '70',
	g: '71',
	h: '72',
	i: '73',
	j: '74',
	k: '75',
	l: '76',
	m: '77',
	n: '78',
	o: '79',
	p: '80',
	q: '81',
	r: '82',
	s: '83',
	t: '84',
	u: '85',
	v: '86',
	w: '87',
	x: '88',
	y: '89',
	z: '90',

	left: '37',
	up: '38',
	right: '39',
	down: '40',

	// [ and ]
	open_bracket: '219',
	close_bracket: '221',

	n0: '48',
	n1: '49',
	n2: '50',
	n3: '51',
	n4: '52',
	n5: '53',
	n6: '54',
	n7: '55',
	n8: '56',
	n9: '57',

	// '\'
	back_slash: '220',
	// '-'
	minus: '189',
	// ','
	comma: '188',
	// ','
	semicolon: '186',
	// '='
	equals: '187',
	// '/'
	slash: '191',
	// '.'
	period: '190',
	// 'enter'
	enter: '13',
	BackSpace: '8',
};
// shift
const shift_nums = {
	'`': '~',
	1: '!',
	2: '@',
	3: '#',
	4: '$',
	5: '%',
	6: '^',
	7: '&',
	8: '*',
	9: '(',
	0: ')',
	'-': '_',
	'=': '+',
	';': ':',
	'\'': '"',
	',': '<',
	'.': '>',
	'/': '?',
	'\\': '|',
};

// Special Keys - and their codes
const special_keys = {
	esc: 27,
	escape: 27,
	tab: 9,
	space: 32,
	return: 13,
	enter: 13,
	backspace: 8,

	scrolllock: 145,
	scroll_lock: 145,
	scroll: 145,
	capslock: 20,
	caps_lock: 20,
	caps: 20,
	numlock: 144,
	num_lock: 144,
	num: 144,

	pause: 19,
	break: 19,

	insert: 45,
	home: 36,
	delete: 46,
	end: 35,

	pageup: 33,
	page_up: 33,
	pu: 33,

	pagedown: 34,
	page_down: 34,
	pd: 34,

	left: 37,
	up: 38,
	right: 39,
	down: 40,

	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
};
export { key, shift_nums, special_keys };
