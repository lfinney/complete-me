import { expect, assert } from 'chai';
import CompleteMe from '../scripts/Complete-Me';
let completion;

describe('Example Test File', () => {

  beforeEach( () => {
    completion = new CompleteMe;
  });

  it('should be an object', () => {
    expect(completion).to.be.an('object')
  });

  it('should have function to insert a new word as a string', () => {
    expect(completion.insert).to.be.a('function')
    completion.insert('Gizmo');
    expect(completion.words.length).to.equal(1);
    expect(completion.words[0]).to.equal('Gizmo');
  });

  it('should have function to count each word passed to it by incrementing', () => {
    expect(completion.count).to.be.a('function')
    completion.insert('Gizmo');
    completion.insert('Rusty');
    completion.insert('Chance');
    expect(completion.wordCount).to.equal(3);
    completion.words.pop();
    completion.count();
    expect(completion.wordCount).to.equal(2);


  });
})
