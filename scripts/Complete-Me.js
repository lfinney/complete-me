class CompleteMe {
  constructor() {
    this.words = [];
  }

  insert(word) {
    this.words.push(word);
    this.count();
    console.log(this);

  }

  count() {
    this.wordCount = this.words.length
  }
}

module.exports = CompleteMe;
