
const parser = new DOMParser();

class Jastrow {
	static formatDefinition(obj) {
		let { grammar: { verbal_stem = "", binyan_form } = {}, definition, senses = [] } = obj;
        if (!definition) {
            const items = senses.map(a => `<li>${a.definition}</li>`).join("");
            definition = `<ul>${items}</ul>`;
        }

        binyan_form = binyan_form === undefined ? "" : " - " + binyan_form.join(", ");
        
		return `${verbal_stem}${binyan_form} ${definition}<br/>`;
	}
	static async serverLookup(word) {
		const options = { method: 'GET', headers: { accept: 'application/json'} }
		const response = await fetch(`https://www.sefaria.org/api/words/${word}`, options);
		const results = await response.json();
		const found = [];
		console.log(results);
		for (const result of results) {
			if (result.parent_lexicon == 'Jastrow Dictionary') {
				console.log(result);
				const entries = result.content.senses.map(Jastrow.formatDefinition).join();
				found.push(`${result.headword} ${(result.alt_headwords || []).joinOrBlank(", ")} ${result.language_code} ${entries}`);
			}
		}
		return found;
	}
}