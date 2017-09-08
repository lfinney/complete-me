import fs from 'fs';
import { expect } from 'chai';
import CompleteMe from '../scripts/CompleteMe';
import AddLetter from '../scripts/AddLetter';
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

    it('when passed word should create a new letter instance', () => {
      completion.insert('Gizmo')
      expect(completion.directory).to.be.instanceOf(AddLetter);
    });

    it('should put first letter in data structure', () => {
      completion.insert('Gizmo')
      expect(completion.directory.child.g.letter).to.equal('g');
    });

    it('letters should have children letters in order to make words', () => {
      completion.insert('Gizmo')
      expect(completion.directory.child.g.child.i.child.z.letter).to.equal('z');
    });

    it('should set endOfWord to true when a word is complete', () => {
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
      completion.insert('doggos');
      completion.insert('dogs');
      completion.insert('dog');
      expect(completion.directory.child.d.child.o.child.g.endOfWord).to.equal(true);
      expect(completion.directory.child.d.child.o.child.g.child.s.endOfWord).to.equal(true);
      expect(completion.directory.child.d.child.o.child.g.child.g.child.o.child.s.endOfWord).to.equal(true);
    });

    it('should not increment count when you try to insert a word that already exists', () => {

      completion.insert('macaroni');
      expect(completion.wordTotal).to.equal(1);
      completion.insert('macaroni');
      expect(completion.wordTotal).to.equal(1);
    });

  });

  describe('Count() Tests', () => {

    it('should have method to count each word passed to it by incrementing', () => {
      expect(completion.count).to.be.a('function')
      completion.insert('Gizmo');
      completion.insert('Rusty');
      completion.insert('Chance');
      expect(completion.wordTotal).to.equal(3);
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

    it('should have method to that suggest words that have the same prefix as previously submitted words', () => {

      expect(completion.suggest).to.be.a('function')
      let search = completion.suggest('g');

      expect(search).to.include('grain');
    });

    it('should be able to suggest words from a dictionary', () => {
      completion.populate(dictionary);
      let search = completion.suggest('bro');

      expect(search).to.include('bronco');
    });

    it('should suggest words from dictionary that share a common root', () => {
      completion.populate(dictionary);
      let search = completion.suggest("piz");

      expect(search).to.deep.equal(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
    });
  });

  describe('Tests with Dictionary Imported', () => {

    it('should import dictionary to completion object', (done) => {
      completion.populate(dictionary);
      expect(completion.wordTotal).to.equal(234371);
      done()
    }).timeout(40000);

  });

  describe('Select() Test', () => {

    it('should order selected items before alphabetical items', () => {
      completion.populate(dictionary);
      let search = completion.suggest("piz");

      expect(search).to.deep.equal(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
      completion.select("pizzeria");
      let selection = completion.suggest("piz");

      expect(selection).to.deep.equal(["pizzeria", "pize", "pizza", "pizzicato", "pizzle"]);
    });

    it('should prioritize multiple selected items in proper order', () => {
      completion.populate(dictionary);
      let search = completion.suggest("bro");

      expect(search).to.include("bronco", "bro", "brown");
      completion.select("bronco");
      completion.select("bronco");
      completion.select("bronco");
      completion.select("broke");
      completion.select("broke");
      completion.select("brown");
      let selection = completion.suggest("bro");

      expect(selection[0]).to.deep.equal("bronco");
      expect(selection[1]).to.deep.equal("broke");
      expect(selection[2]).to.deep.equal("brown");
    });
  })
});
