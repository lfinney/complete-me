const AddLetter = require('./Add-Letter');


class CompleteMe {
  constructor() {
    this.directory = null;
    this.wordTotal = 0;
    // this.matchingPrefix = [];
  }

  insert(word) {

    const addLetter = new AddLetter();

    if (this.directory === null) {
      this.directory = addLetter
    }
    let arrayedString = [...word.toLowerCase()];
    let nextLetter = this.directory;

    arrayedString.forEach( (letter) => {
      if (!nextLetter.child[letter]) {
        nextLetter.child[letter] = new AddLetter(letter);
      }
      nextLetter = nextLetter.child[letter];
    });

    nextLetter.endOfWord = true;
    this.wordTotal++;

  }


  count() {
    return this.wordTotal;
  }

  suggest(query) {
    let prefixSearch = [...query.toLowerCase()];
    let currentNode = this.directory;
    let matchingWords = [];

    for (let i = 0; i < prefixSearch.length; i++) {
      currentNode = currentNode.child[prefixSearch[i]]
    }

    const findWord = (query, currentNode) => {

      const keys = Object.keys(currentNode.child);

      for (let j = 0; j < keys.length; j++) {
        let nextLetter = currentNode.child[keys[j]];
        let foundWord = query.concat(nextLetter.letter);

        if (nextLetter.endOfWord) {
          matchingWords.push(foundWord)
        }
        findWord(foundWord, nextLetter);
      }
    };
    findWord(query, currentNode);

    if (query && currentNode.endOfWord) {
      matchingWords.push(query)
    }

    console.log(matchingWords);
    return matchingWords;
  }

  populate(index) {
    index.forEach( (word) => {
      this.insert(word);
    });
  }
}

module.exports = CompleteMe;
