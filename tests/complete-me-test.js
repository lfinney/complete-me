import fs from 'fs';
import { expect, assert } from 'chai';
import CompleteMe from '../scripts/Complete-Me';
import AddLetter from '../scripts/Add-Letter';
let completion;

const text = "/usr/share/dict/words";
const dictionary = fs.readFileSync(text).toString().trim().split('\n');

describe('CompleteMe Tests', () => {

  beforeEach( () => {
    completion = new CompleteMe();
  });

  it('completion object should default to null', () => {
    expect(completion).to.be.an('object')
    expect(completion.directory).to.equal(null)
  });

  describe('Insert() Tests', () => {

    it('when passed a word, the words object should create a new letter instance', () => {
      completion.insert('Gizmo')
      expect(completion.directory).to.be.instanceOf(AddLetter);
    });

    it('should be able to rake the first letter off of a word and store it as a letter', () => {
      completion.insert('Gizmo')
      expect(completion.directory.child.g.letter).to.equal('g');
    });

    it('letters should have children letters in order to make words', () => {
      completion.insert('Gizmo')
      expect(completion.directory.child.g.child.i.child.z.letter).to.equal('z');
    });

    it('should set endOfWord property to true when a word is completely entered', () => {
      completion.insert('Gizmo')
      expect(completion.directory.child.g.child.i.child.z.child.m.endOfWord).to.deep.equal(false);
      expect(completion.directory.child.g.child.i.child.z.child.m.child.o.letter).to.equal('o');
      expect(completion.directory.child.g.child.i.child.z.child.m.child.o.endOfWord).to.equal(true);
    });

    it('should be able to take in multiple words', () => {
      completion.insert('Gizmo');
      completion.insert('Rusty');
      expect(completion.directory.child.g.child.i.child.z.child.m.child.o.endOfWord).to.equal(true);
      expect(completion.directory.child.r.child.u.child.s.child.t.child.y.endOfWord).to.equal(true);
    });

    it('should be able to take in multiple words that share similar roots', () => {
      completion.insert('doggies');
      completion.insert('dogs');
      completion.insert('dog');
      expect(completion.directory.child.d.child.o.child.g.endOfWord).to.equal(true);
      expect(completion.directory.child.d.child.o.child.g.child.s.endOfWord).to.equal(true);
      expect(completion.directory.child.d.child.o.child.g.child.g.child.i.child.e.child.s.endOfWord).to.equal(true);
    });

  });

  describe('Count() Tests', () => {

    it('should have method to count each word passed to it by incrementing', () => {
      expect(completion.count).to.be.a('function')
      completion.insert('Gizmo');
      completion.insert('Rusty');
      completion.insert('Chance');
      expect(completion.wordTotal).to.equal(3);
      // completion.words.pop();
      // completion.count();
      // expect(completion.wordTotal).to.equal(2);
    });
  });

  describe('Suggest() Tests', () => {
    beforeEach( () => {
      completion.insert('grain');
      completion.insert('grass');
      completion.insert('gist');
      completion.insert('gizmo');
    });

    it('should have method that takes a prefix search query in the form of a string as an argument and spreads it into an raay', () => {
      expect(completion.suggest).to.be.a('function')
      let search = completion.suggest('gizmo');

      expect(search).to.deep.equal(['gizmo']);

    });

    it('should have method to that suggest words that have the same prefix as previously submitted words', () => {

      expect(completion.suggest).to.be.a('function')
      let search = completion.suggest('gi');

      expect(search).to.deep.equal(['gist', 'gizmo']);
    });

    it.only('should have method to that suggest words that have the same prefix as previously submitted words', () => {

      expect(completion.suggest).to.be.a('function')
      let search = completion.suggest('g');

      expect(search).to.include('grain');
    });
  });


  describe('Tests with Dictionary Imported', () => {

    it('should import dictionary to completion object', (done) => {
      completion.populate(dictionary);
      expect(completion.wordTotal).to.equal(235886);
      console.log(completion.directory);
      done()
    }).timeout(40000);
  });
})
