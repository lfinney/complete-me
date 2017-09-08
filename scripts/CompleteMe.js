const AddLetter = require('./AddLetter');


class CompleteMe {
  constructor() {
    this.directory = null;
    this.wordTotal = 0;
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

    if (!nextLetter.endOfWord) {
      nextLetter.endOfWord = true;
      this.wordTotal++;
    }
  }


  count() {
    return this.wordTotal;
  }

  suggest(query) {
    let matchingWords = [];
    let currentNode = this.findAWord(query);

    const findWord = (query, currentNode) => {
      const keys = Object.keys(currentNode.child);

      for (let j = 0; j < keys.length; j++) {
        let nextLetter = currentNode.child[keys[j]];
        let foundWord = query.concat(nextLetter.letter);

        if (nextLetter.endOfWord) {
          matchingWords.push({word: foundWord, frequency: nextLetter.frequency})
        }
        findWord(foundWord, nextLetter);
      }
    };

    findWord(query, currentNode);
    if (query && currentNode.endOfWord) {
      matchingWords.push({word: query, frequency: currentNode.frequency})
    }

    matchingWords.sort( (a, b) => {
      return b.frequency - a.frequency
    });


    return matchingWords.map( (wordObjects) => {
      return wordObjects['word']
    });
  }

  populate(index) {
    index.forEach( (word) => {
      this.insert(word);
    });
  }

  findAWord(query) {
    let prefixSearch = [...query.toLowerCase()];
    let currentNode = this.directory;

    for (let i = 0; i < prefixSearch.length; i++) {
      currentNode = currentNode.child[prefixSearch[i]];
    }
    return currentNode
  }

  select(selection) {
    let selectedWord = this.findAWord(selection);

    selectedWord.frequency++
  }
}

module.exports = CompleteMe;
