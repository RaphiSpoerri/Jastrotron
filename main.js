
const E = {
  word: document.getElementById("word"),
  dictResult: document.getElementById("result"),
};


class Jastrow {
	static async serverLookup(word) {
		const options = { method: 'GET', headers: { accept: 'application/json'} }
		const response = await fetch(`https://www.sefaria.org/api/words/${word}`, options);
		const results = await response.json();
		const found = [];
		for (const entry of results) {
			if (entry['parent_lexicon'] == 'Jastrow Dictionary') {
				found.push(`${entry.headword}, ${(entry.alt_headwords || []).join(", ")} ${entry.content.senses.map(a => `<p>*) ${a.definition}</p>`).join()}`);
    				console.log(entry.content.senses.map(a => Object.keys(a)).join(","));
			}
		}
		return found;
	}
}
async function search() {
  E.dictResult.innerHTML = (await Jastrow.serverLookup(E.word.value)).join("<br>");
}
