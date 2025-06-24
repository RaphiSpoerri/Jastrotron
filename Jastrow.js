
const parser = new DOMParser();

function toggle(text) {
    return `<span><button onclick="const s = this.parentNode.getElementsByTagName('div')[0];\
            s.style.display = s.style.display == 'block' ? 'none' : 'block'">⊕</button> \
        <div style="display: none;">${text}</div>
        </span>`
}
function formatQuotes(text) {
    let i = text.indexOf('<i');
    let result = "";
    // for (; i < text.length;) {
    //     let j = text.indexOf('<i', i + 1);
    //     if (j == -1) j = text.length;
    //     const m = />([^<]*)<\/i>((?:.|\n)*)/.exec(text.substring(i, j));
    //     if (m == null) {
    //         const remaining = text.slice(i);
    //         console.log(remaining);
    //         if (remaining.trim() != "")
    //             result += remaining;
    //         break;
    //     }
    //     const [_, italics, quotes] = m;
    //     if (quotes.trim() == ',]') {
    //         result += `<li>[<i>${italics}</i>]</li>`;
    //     } else result += `<li><i>${italics}</i> - ${toggle(quotes)}</li>`;
    //     i = j;
    // }
    
    const m = />([^<]*)<\/i>/.exec(text.substring(i));
    let italics, quotes;
    if (m === null) {
        italics = /^\s*\<a[^\>]+>same/.test(text) ? "(same)" : '';
        quotes = text;
    } else {
        italics = `<i>${m[1]}</i>`;
        quotes = text.substring(text.indexOf('</i>', i) + 4).replace(/<a/g, '<br/><a').replace(/href=(["'])/g, `target="_blank" href=$1https://www.sefaria.org`);
    }
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
		const options = { method: 'GET', headers: { accept: 'application/json'} }
		const response = await fetch(`https://www.sefaria.org/api/words/${word}`, options);
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
		return found;
	}
}