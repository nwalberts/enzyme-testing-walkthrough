// test/containers/ElephantContainer.js
import ElephantContainer from '../../src/containers/ElephantContainer';
import Elephant from '../../src/components/Elephant';

describe('ElephantContainer', () => {
  let wrapper;

  beforeEach(() => {
    spyOn(ElephantContainer.prototype, 'handleClick').and.callThrough();
    // In this case, we spy on the creation of any ElephantContainer objects
    // listen to their "handleClick" method
    // And allow them to function as expected with the callThrough()


    wrapper = mount(<ElephantContainer />);
  });

  it('should have the specified initial state', () => {
    expect(wrapper.state()).toEqual({ babyElephant: false });
  })
  // .state returns the object state of a component
  // then we do a deep equality matcher === for the state

  it('should render an Elephant Component', () => {
    expect(wrapper.find(Elephant)).toBePresent();
  });
  // presence matcher for the rendering of a child component! Remember that we are in a quasi DOM,
  // so we can look for child elements within parent elements

  it('should render the Elephant Component with specific props when babyElephant is false', () => {
    expect(wrapper.find(Elephant).props()).toEqual({
      image: "https://s3.amazonaws.com/horizon-production/images/elephant_2.jpg",
      onClick: jasmine.any(Function),
      text: 'that\'s a big elephant'
    });
  });
  // a deep equality matcher,for the props of a child component
  // jasmine.any(Function) just helps us test that the Elephant compoent received a function as props

  it('should render the Elephant Component with specific props when babyElephant is true', () => {
    wrapper.setState({ babyElephant: true });
    expect(wrapper.find(Elephant).props()).toEqual({
      image: "https://s3.amazonaws.com/horizon-production/images/elephant_1.jpg",
      onClick: jasmine.any(Function),
      text: "Look at the baby elephant!"
    })
  })
  // check props in a different situation, when state is different

  describe('handleClick', () => {
    it('should be invoked when the onClick property of the Elephant component is called', () => {
      wrapper.find(Elephant).props().onClick();
      expect(ElephantContainer.prototype.handleClick).toHaveBeenCalled();
    });
    // Check that the function was called succeesfully

    it('should change the babyElephant property in the state to the opposite boolean value', () => {
      wrapper.find(Elephant).props().onClick();
      expect(wrapper.state()).toEqual({ babyElephant: true });
    });
    // Check that the outcome of the handleClick function is a state change.
    // handleClick doesnt have to have a specific return, so we need to test a state change side effect to test
    // the method correctly
  });
});
