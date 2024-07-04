
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
			if (entry['parent_lexicon'] == 'Jastrow Dictionary')
				found.push(entry['content']['senses'].map(a => "*) " + a['definition']).join());
		}
    console.log(found);
		return found;
	}
}
async function search() {
  E.dictResult.innerHTML = (await Jastrow.serverLookup(E.word.value)).join("<br>");
}
