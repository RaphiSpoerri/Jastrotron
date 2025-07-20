

function toggle(text) {
    return `<span><span class="quotes-button" onclick="const s = this.parentNode.getElementsByTagName('div')[0];\
            s.style.display = s.style.display == 'block' ? 'none' : 'block'">[more]</span> \
        <div style="display: none;">${text}</div>
        </span>`
}
function formatQuotes(text) {
    let i = text.indexOf('<i');
    let result = "";

    const m = />([^<]*)<\/i>/.exec(text.substring(i));
    let italics, quotes;
    if (m === null) {
        italics = /^\s*\<a[^\>]+>same/.test(text) ? "(same)" : '(more)';
        quotes = text;
    } else {
        italics = `<i>${m[1]}</i>`;
        quotes = text.substring(text.indexOf('</i>', i) + 4);
    }
    quotes = quotes.replace(/<a/g, '<br/><a').replace(/<a[^>]+>[^<]+<\/a>/g, m => {
        const parts = /href="\/Jastrow,([^"]+)"[^>]*>([^<]*)/.exec(m);
        if (parts == null) {
            return m;
        }
        return `<button onclick="search('${parts[1].split(' ')[0]}')">${parts[2]}</button>`;
    });
    if (quotes.trim() == ',]') {
        result += `[${italics}]`;
    } else result += `${italics} - ${toggle(quotes)}`;
    return result;
}
function formatDefinition(obj) {
    let { grammar: { verbal_stem = "", binyan_form } = {}, definition = "", senses = [] } = obj;
    if (definition != "") definition = formatQuotes(definition);
    if (senses.length > 0) {
        const items = senses.map(a => `<li>${formatQuotes(a.definition)}</li>`).join("");
        definition += `<ol>${items}</ol>`;
    }

    binyan_form = binyan_form === undefined ? "" : " - " + binyan_form.join(", ");
    
    return `${verbal_stem}${binyan_form} ${definition}`;
}

class Jastrow {
	static async serverLookup(word) {
        word = word.replace(/[כמנפצ]$/, m => String.fromCharCode(m[0].charCodeAt(0) - 1))
		const options = { method: 'GET', headers: { accept: 'application/json'} };
        let response;
		try {
            response = await fetch(`https://www.sefaria.org/api/words/${word}`, options);
        } catch (e) {
            if (e instanceof TypeError) return [`<span style="color: red;">no internet</span>`];
            else throw e;
        }
        const results = await response.json();
		const found = [];
		console.log(results);
		for (const result of results) {
			if (result.parent_lexicon == 'Jastrow Dictionary') {
				console.log(result);
                const first = result.content.senses[0];
				const entries = result.content.senses.map(a => formatDefinition(a)).join('<br/>');
				found.push(`${result.headword}${(result.alt_headwords ?? []).map(a => ", " + a).joinOrBlank("")} ${result.language_code ?? "?"} ${/^[^\(]*\)/.exec(first.definition)?.[0] ?? ''} <ul>${entries}</ul>`);
			}
		}
		return found.length == 0 ? [`<span style="color: red;">word not found</span>`] : found;
	}
}