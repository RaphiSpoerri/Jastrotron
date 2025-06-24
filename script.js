
const Elem = {
  word: document.getElementById("word"),
  keyboard: document.getElementById("keyboard"),
  dictResult: document.getElementById("result"),
};

Array.prototype.joinOrBlank = function(sep) {
	return this.length == 0 ? "" : this.join(sep);
}

function strObj(a, tab = '') {
	if (Array.isArray(a)) return `[${a.map(b => strObj(b, tab + '  ')).join(", ")}]`;
	if (a instanceof String || typeof a == 'string') return `"${a}"`;
	if (a.constructor != Object) return `${a}`;
	let result = `{\n`;
	for (const key of Object.keys(a)) {
		result += `${tab}  ${key}: ${ strObj(a[key], tab + '  ')},\n`;
	}
	return result + tab + '}';
}

async function search() {
  Elem.dictResult.innerHTML = (await Jastrow.serverLookup(Elem.word.value)).join("<br>");
}

const keyboard = new Keyboard(Elem.word, Elem.keyboard, {
	a: 'א', b: 'ב', g: 'ג',
	d: 'ד', h: 'ה', v: 'ו',
	z: 'ז', x: 'ח', T: 'ט', f: 'ט',
	y: 'י', k: 'כ', l: 'ל',
	m: 'מ', n: 'נ', s: 'ס',
	j: 'ע', p: 'פ', c: 'צ',
	q: 'ק', r: 'ר', w: 'ש',
	t: 'ת'
	//               
});
