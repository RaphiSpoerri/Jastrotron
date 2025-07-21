
// אבגדהוזחטיכלמנסעפצקרשת
class Keyboard {
    constructor(output, input, keyMap) {
        this._output = output;
        this._input = input;
        this._keyMap = keyMap;
        this._output.addEventListener('keydown', e => this._onkeydownCallback(e));
        this.showOnscreen();
    }

    _addButton(row, letter) {
        const button = document.createElement('button');
        button.onclick = () => this._insertText(letter);
        button.innerHTML = letter;
        button.className = 'keyboard-key';
        const column = document.createElement('td');
        column.appendChild(button);
        row.appendChild(column);
    }

    showOnscreen() {
        const ones = document.createElement('tr');
        const tens = document.createElement('tr');
        const hundreds = document.createElement('tr');
        'אבגדהוזחט'.split('').forEach(letter => this._addButton(ones, letter));
        'יכלמנסעפצ'.split('').forEach(letter => this._addButton(tens, letter));
        
        'קרשת'.split('').forEach(letter => this._addButton(hundreds, letter));

        const table = this._input;
        table.appendChild(ones);
        table.appendChild(tens);
        table.appendChild(hundreds);
    }

    _insertText(text) {
        const { selectionStart: start, selectionEnd: end } = this._output;
        this._output.setRangeText(text, start, end, 'end');
    }
    _onkeydownCallback(e) {
        const letter = this._keyMap[e.key];
        
        if (letter !== undefined) {
            e.preventDefault();
            this._insertText(letter);
        }
    }
}