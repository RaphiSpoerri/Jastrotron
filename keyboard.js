
// אבגדהוזחטיכלמנסעפצקרשת
class Keyboard {
    constructor(output, input, keyMap) {
        this._output = output;
        this._input = input;
        this._keyMap = keyMap;
        this._output.addEventListener('keydown', e => this._onkeydownCallback(e));
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

    _insertText(text) {
        const { selectionStart: start, selectionEnd: end } = this._output;
        this._output.setRangeText(text, start, end, 'end');
    }
    _onkeydownCallback(e) {
        if (e.key == 'Enter') {
            e.preventDefault();
            search();
            return;
        }
        const letter = this._keyMap[e.key];
        
        if (letter !== undefined) {
            e.preventDefault();
            this._insertText(letter);
        }
    }
}