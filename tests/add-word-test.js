import { expect } from 'chai';
import AddLetter from '../scripts/AddLetter';
let addLetter;

describe('AddLetter Tests', () => {

  beforeEach( () => {
    addLetter = new AddLetter;
  });

  it('should be an object', () => {
    expect(addLetter).to.be.an('object')
  });


})
