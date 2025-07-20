
const Elem = {
  word: document.getElementById("word"),
  keyboard: document.getElementById("keyboard"),
  dictResult: document.getElementById("result"),
};

Array.prototype.joinOrBlank = function(sep) {
	return this.length == 0 ? "" : this.join(sep);
}

async function redirect(to) {
	Elem.word.value = to;
	await search();
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

async function search(word) {
	if (word === undefined) word = Elem.word.value;
	Elem.dictResult.innerHTML = (await Jastrow.serverLookup(word)).join("<br>");
}

const keyboard = new Keyboard(Elem.word, Elem.keyboard, {
	a: 'א', b: 'ב', g: 'ג',
	d: 'ד', h: 'ה', u: 'ו', w: 'ו', v: 'ו', u: 'ו',
	z: 'ז', x: 'ח', T: 'ט', H: 'ח',
	i: 'י', k: 'כ', l: 'ל', y: 'י',
	m: 'מ', n: 'נ', s: 'ס',
	j: 'ע', p: 'פ', S: 'צ', f: 'פ',
	q: 'ק', r: 'ר', c: 'ש', 
	t: 'ת'
	//               
});
