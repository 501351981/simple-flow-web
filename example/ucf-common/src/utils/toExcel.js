import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function s2ab(s) {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i !== s.length; ++i) {
		view[i] = s.charCodeAt(i) & 0xff;
	}

	return buf;
}

function data2ws(data) {
	const ws = {};
	const range = {
		s: {
			c: 10000000,
			r: 10000000,
		},
		e: {
			c: 0,
			r: 0,
		},
	};
	for (let R = 0; R !== data.length; ++R) {
		for (let C = 0; C !== data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R;
			if (range.s.c > C) range.s.c = C;
			if (range.e.r < R) range.e.r = R;
			if (range.e.c < C) range.e.c = C;
			const cell = {
				v: data[R][C],
			};
			if (cell.v == null) continue;
			const cellRef = XLSX.utils.encode_cell({
				c: C,
				r: R,
			});
			if (typeof cell.v === 'number') cell.t = 'n';
			else if (typeof cell.v === 'boolean') cell.t = 'b';
			else if (cell.v instanceof Date) {
				cell.t = 'n';
				cell.z = XLSX.SSF._table[14];
			} else {
				cell.t = 's';
			}
			ws[cellRef] = cell;
		}
	}
	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

	return ws;
}

function Workbook() {
	if (!(this instanceof Workbook)) {
		return new Workbook();
	}
	this.SheetNames = [];
	this.Sheets = {};
}
/*
 * th => 表头
 * data => 数据
 * fileName => 文件名
 * fileType => 文件类型
 * sheetName => sheet页名
 */
export default function toExcel({
	th,
	data,
	fileName,
	fileType,
	sheetName,
	needSheetDic,
	description, // 字段说明数据
}) {
	const wb = new Workbook();
	if (Array.isArray(data)) {
		data.unshift(th);
		const ws = data2ws(data);
		sheetName = sheetName || 'sheet1';
		wb.SheetNames.push(sheetName);
		wb.Sheets[sheetName] = ws;
		if (needSheetDic) {
			const wsDic = data2ws(description);
			wb.SheetNames.push(lang.template('P_YS_FED_IMP_IOT_0001087133') /* "字段说明" */);
			wb.Sheets[lang.template('P_YS_FED_IMP_IOT_0001087133') /* "字段说明" */] = wsDic;
		}
	} else {
		const keys = Object.keys(data);
		wb.SheetNames = keys;
		for (const key of keys) {
			data[key].unshift(th);
			wb.Sheets[key] = data2ws(data[key]);
		}
	}
	fileType = fileType || 'xlsx';
	const wbout = XLSX.write(wb, {
		bookType: fileType,
		bookSST: false,
		type: 'binary',
	});
	fileName = fileName || lang.template('P_YS_PF_GZTLOG_0000025980'); /* "列表" */
	saveAs(
		new Blob([s2ab(wbout)], {
			type: 'application/octet-stream',
		}),
		`${fileName}.${fileType}`
	);
}
