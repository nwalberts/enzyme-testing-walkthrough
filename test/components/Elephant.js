// test/components/Elephant.js
import Elephant from '../../src/components/Elephant';

describe('Elephant', () => {
  let image,
      fakeVersionOfHandleClick,
      text,
      wrapper;

  beforeEach(() => {
    fakeVersionOfHandleClick = jasmine.createSpy('onClick spy');
    // a spy is like a listenner for a specific function.
    // it creates a stub, or a dummy, that listens for the function call, stops it, but records what happened


    wrapper = mount(
      <Elephant
        image="http://fakeurl.com/elephant"
        onClick={fakeVersionOfHandleClick}
        text="I am an Elephant!"
      />
    );
  });

  // Note that below we do an exhaustive check. Its more than a unit test, but less than an integration test
  // the whole of these tests ensure that the component is functioning as planned

  it('should render an h1 tag', () => {
    expect(wrapper.find('h1')).toBePresent();
  });
  // shows traversing the wrapper
  // presence matcher
  // similar to respec but with more parens
  // show .debug()

  it('should render an h1 tag with the text property value', () => {
    expect(wrapper.find('h1').text()).toBe('I am an Elephant!');
  });
  // text returns a text string
  // toBe is a deep equality matcher

  it('should render an img tag with the specific props', () => {
    console.log(wrapper.find('img').props())

    expect(wrapper.find('img').props()).toEqual({
      src: 'http://fakeurl.com/elephant',
      width: '600',
      height: '400'
    });
  });
  // The props() method returns the literal OBJECT properties of an object. In this case, the element attributes

  it('should invoke the onClick function from props when clicked', () => {
    wrapper.simulate('click');
    expect(fakeVersionOfHandleClick).toHaveBeenCalled();
  });
});
// Our spy helps us ensure that an event listener is set correctly on the component
// It doesnt matter the return of the function, thats handled by the other test where the component was defined
// we only need to test that the onClick was called, not what it triggers
