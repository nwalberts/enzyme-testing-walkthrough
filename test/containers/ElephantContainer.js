import ElephantContainer from '../../src/containers/ElephantContainer';
import Elephant from '../../src/components/Elephant';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';

describe('ElephantContainer', () => {
  let wrapper;

  beforeEach(() => {
    jasmineEnzyme();
    wrapper = mount(<ElephantContainer />);
  });

  it('should return true', () => {
    expect(true).toEqual(true);
  });
});
