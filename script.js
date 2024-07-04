
const E = {
  word: document.getElementById("word"),
  dictResult: document.getElementById("result"),
};

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

class Jastrow {
	static async serverLookup(word) {
		const options = { method: 'GET', headers: { accept: 'application/json'} }
		const response = await fetch(`https://www.sefaria.org/api/words/${word}`, options);
		const results = await response.json();
		const found = [];
		for (const entry of results) {
			if (entry.parent_lexicon == 'Jastrow Dictionary') {
				console.log(strObj(entry));
				found.push(`${entry.headword} ${(entry.alt_headwords || []).join(", ")} ${entry.language_code} ${entry.content.senses.map(a => `${a.grammar?.verbal_stem ?? ""} - ${a.grammar?.binyan_form?.join(", ") ?? ""} ${a.definition ?? a.senses.map((a, i) => `${a.definition}`).join("<br/>")}<br/>`).join()}`);
			}
		}
		return found;
	}
}
async function search() {
  E.dictResult.innerHTML = (await Jastrow.serverLookup(E.word.value)).join("<br>");
}
