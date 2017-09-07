import { expect, assert } from 'chai';
import AddLetter from '../scripts/Add-Letter';
let addLetter;

describe('AddLetter Tests', () => {

  beforeEach( () => {
    addLetter = new AddLetter;
  });

  it('should be an object', () => {
    expect(addLetter).to.be.an('object')
  });


})
