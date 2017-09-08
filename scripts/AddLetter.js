class AddLetter {
  constructor(letter = null) {
    this.letter = letter;
    this.endOfWord = false;
    this.child = {};
    this.frequency = 0;
  }
}

module.exports = AddLetter;
