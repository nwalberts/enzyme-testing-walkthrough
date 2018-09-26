## Learning Objectives
* Understand the purpose of the Enzyme library.
* Setup Enzyme with Karma and Jasmine.
* Learn to test React components with Enzyme.

## Getting Started
After configuring our test environment, the next step is to implement tests for each of your React Components.

To get started:

```
$ et get testing-react-components-implementation
$ yarn install
$ yarn run test
```

At this point, you should have two passing tests.

If karma does not work immediately, try these commands:

```
$ yarn global remove karma
$ yarn global add karma-cli
```

To get the server running:

```
$ yarn run start
```

In the browser, visit http://localhost:8080/

## Testing a React Application
The relevant files in our application are

* `main.js`
* `src/containers/ElephantContainer.js`
* `src/components/Elephant.js`

To look at the page, we can run `yarn run start` and then navigate to http://localhost:8080/. When the page loads, we see the initial state of our application:

![Testing React Components 1][testing-react-components-1]

Clicking on the elephant changes the state of our application to `babyElephant: true`, and changes the image and text to:

![Testing React Components 2][testing-react-components-2]

If we click on the elephant again, we go back to the initial state:

![Testing React Components 1][testing-react-components-1]

To recap, our component tree includes an `ElephantContainer`, which has a function to change the state of `babyElephant` from `false` to `true` and back. It also sets the `image` and `text` properties appropriately. The `ElephantContainer` then renders the `Elephant` presentational component, which has the event listener for the `handleClick` function.

### Deciding What to Test

Before we get into actually writing tests, let's take a step back and talk about *what* we should test. We want a well-tested app that will let us know when something is breaking, but we also want to get the most bang for our buck with each test we write. One way to get started making design decisions like this is to think about the most important things that each component is doing.

Our `ElephantContainer` is:
* Keeping track of the status of `babyElephant` in `state`
* Holding a function that updates state upon click
* Passing down props to our `Elephant` component

Our `Elephant` component is:
* Receiving props from our `ElephantContainer`
* Displaying an `img` tag with those props
* Displaying an `h2` tag with those props
* Running an `onClick` function when the component is clicked

Given this focus on what we want our components to be responsible for, we can focus on what are the most important things to test:

* That the `ElephantContainer` is passing down the correct props when `babyElephant` is `true` and when it is `false`
* That given some arbitrary props, the `Elephant` component renders the html nodes that we expect with those props
* That clicking the `Elephant` component triggers the `onClick` function and updates the `ElephantContainer` state


### Testing Presentational React Components

This application is untested, so let's start to fix that by first writing a test
for `Elephant` component, which simply returns a `<div>` with `image`, `text`, and `onClick` properties.

```javascript
// src/components/Elephant.js
import React from 'react';

const Elephant = props => {

  return (
    <div onClick={props.onClick} className="center">
      <img src={props.image} height="400" width="600" />
      <h1>{props.text}</h1>
    </div>
  );
};

export default Elephant;

```

We begin with the following test:

```javascript
// test/components/Elephant.js
import Elephant from '../../src/components/Elephant';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';

describe('Elephant', () => {
  let image,
      text,
      wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Elephant
        image="http://fakeurl.com/elephant"
        text="I am an Elephant!"
      />
    );
  });

});
```

We import the `mount` function from the Enzyme library. This function takes in a
`ReactElement` which represents a component and returns a `ReactWrapper`
object. The `mount` function essentially puts our React Element on the DOM, which in this case will be our PhantomJS headless browser. We can actually run our test files from the command line:

```sh
yarn run test
```

We first want to assert the presence of an `h1` tag. We can use the `jasmine-enzyme` library that we installed so we
can use matchers that will increase the readability of our tests. Using the `wrapper` variable we assigned to our `Elephant` component, we can write this test:

```javascript
// test/components/Elephant.js

...

beforeEach(() => {
  jasmineEnzyme();
  wrapper = mount(
    <Elephant
      image="http://fakeurl.com/elephant"
      text="I am an Elephant!"
    />
  );
});

  it('should render an h1 tag', () => {
    expect(wrapper.find('h1')).toBePresent();
  });
});
```

Here we imported the `jasmine-enzyme` library, and invoked the `jasmineEnzyme`
function before each of our tests. This allows us to use the [`toBePresent`
matcher][jasmine-enzyme-tobepresent] which asserts for the presence of at least
one node (another name for a React HTML element) in the `wrapper`.

We can also test that the `Elephant` has certain `props`:

```javascript
// test/components/Elephant.js
...

  it('should render an img tag with the specific props', () => {
    expect(wrapper.find('img').props()).toEqual({
      src: 'http://fakeurl.com/elephant',
      height: '400',
      width: '600'
    });
  });
});
```

The [`props` function][enzyme-docs-full-rendering-api-props] can only be called on the `wrapper` of a single `ReactElement`,
and it will return the `props` of the `ReactElement`.

Finally, now that we've tested the HTML on the page and the props passed to the component, we can test the user's interactions with the page by testing our functions. For example, the `onClick` property of the `Elephant`'s `props` should be invoked when the component is clicked. We can actually simulate events on wrappers using the [`simulate` function][enzyme-docs-shallow-rendering-api-simulate]:

```javascript
// test/components/Elephant.js
...

describe('Elephant', () => {
  let image,
      text,
      wrapper,
      onClick; //<-- this is new

  beforeEach(() => {
    jasmineEnzyme();
    onClick = jasmine.createSpy('onClick spy'); //<-- this is new
    wrapper = mount(
      <Elephant
        image="http://fakeurl.com/elephant"
        text="I am an Elephant!"
        onClick={onClick} //<-- this is new
      />
    );
  });

...
//  new test
  it('should invoke the onClick function from props when clicked', () => {
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
```

The `simulate` function takes in the event name as a string for its first argument and an event data as an optional second argument. Notice also that we have added our `onClick` declaration as a spy using [`jasmine.createSpy`][jasmine-docs-createspy] so we can assert that the function is called when the `wrapper` is clicked.

Spies allow us to simply confirm that a function has been called - for example, when we simulate a click on the `Elephant` component, we want to confirm that the `onClick` function is called. We don't care about what the `onClick` function actually does at this point in time - we'll worry about that when testing our `ElephantContainer`. For now, we can just confirm it's called by creating an `onClick spy` as shown above.

We are now done testing our `Elephant` component. Let's move on to testing our `ElephantContainer` stateful component!

### Testing Our Container Component

Let's first write a few tests to assert the initial state of our component
and that we are rendering an `Elephant` component with the correct props:

```javascript
// test/containers/ElephantContainer.js
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

  it('should should have the specified initial state', () => {
    expect(wrapper.state()).toEqual({ babyElephant: false });
  });

```
Our first tests uses the [`state` function][enzyme-docs-full-rendering-api-state] to get
the current state of our wrapper, and assert that it matches the initial state.

```javascript
  it('should render an Elephant Component', () => {
    expect(wrapper.find(Elephant)).toBePresent();
  });
```
Here we pass in the Elephant component to the `find` function to make sure the component is rendering.
  ```javascript
  it('should render the Elephant Component with specific props when babyElephant is false', () => {
    expect(wrapper.find(Elephant).props()).toEqual({
      image: 'https://s3.amazonaws.com/horizon-production/images/elephant_2.jpg',
      onClick: jasmine.any(Function),
      text: 'that\'s a big elephant'
    });
  });
});
```

In this last test, we are asserting the props that are passed to the `Elephant` component when `babyElephant` is false are the ones we expect.  Notice, inside our `expect` block, we call `jasmine.any(Function)`.  This is the part that's firing the onClick handler, and it's doing exactly what you what expect from the language used: it's looking for any function to have been called.

Great, but the `ElephantContainer` will pass
different props to the `Elephant` component when its state changes, so how do we
test that? We can test this by using the [`setState`
function][enzyme-docs-full-rendering-api-setstate] like so:

```javascript
// test/containers/ElephantContainer.js
...

  it('should render the Elephant Component with specific props when babyElephant is true', () => {
    wrapper.setState({ babyElephant: true });
    expect(wrapper.find(Elephant).props()).toEqual({
      image: 'https://s3.amazonaws.com/horizon-production/images/elephant_1.jpg',
      onClick: jasmine.any(Function),
      text: 'Look at the baby elephant!'
    });
  });
});
```

In this test, we just change the state of the `wrapper`, and assert that the
appropriate props are now passed. Now, let's take a look at our `handleClick` function.

In the last two tests, we have simply asserted that the `props` we are passing to the `Elephant` component include an `onClick` property that is simply a function. However, we should test that this function calls the `handleClick` function and it updates the state of the `ElephantContainer` component when it is invoked. We can do this with the help of Jasmine spies:

```javascript
// test/components/ElephantContainer.js
...
  beforeEach(() => {
    jasmineEnzyme();
    spyOn(ElephantContainer.prototype, 'handleClick').and.callThrough(); //<-- this is new
    wrapper = mount(<ElephantContainer />);
  });

...

  describe('handleClick', () => {
    it('should be invoked when the onClick property of the Elephant component is called', () => {
      wrapper.find(Elephant).props().onClick();
      expect(ElephantContainer.prototype.handleClick).toHaveBeenCalled();
    });

    it('should change the babyElephant property in the state to the opposite boolean value', () => {
      wrapper.find(Elephant).props().onClick();
      expect(wrapper.state()).toEqual({ babyElephant: true });
    });
  });
});
```

In the `beforeEach` function, we have once again created a spy on the `handleClick` function. It's important to note that we have to spy on the _prototype_ of stateful components. The `prototype` refers to class `ElephantContainer` in its original form, without anything having been clicked or changed.  We then write a test that invokes the `onClick` property of the `props` passed to the `Elephant` component, and expect our spy to have been called (so far, this is the same as our `Elephant` component tests).

You may have noticed that we added the `callThrough()` function on our spy this time around. As we mentioned in our prior test, `spies` only make sure that a function is run, and _do not actually run through the function itself_. By chaining `.and.CallThrough()` onto our spy, we allow the function to run and can test the return value or result of the function being invoked. Because we used `callThrough`, we were able to write the second test here: testing that the state of `ElephantContainer` has changed as expected.

We can now be confident that our `ElephantContainer` is passing the correct props to our `Elephant` component, has a correctly working `handleClick` function, and our `Elephant` component is showing us the expected picture and text!

## Cleaning Up the Test Suite
Currently, we have to import the same packages in every test file and execute
`jasmineEnzyme` in a `beforeEach` function if we want to use `jasmine-enzyme`
matchers. Luckily, we can modify our `test/testHelper.js` file so we do not have
to do this for every test file. We make the following changes:

```javascript
// test/testHelper.js

import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';

Object.assign(global, {
  mount,
  jasmineEnzyme,
  React
});

// this will happen before every test
beforeEach(() => {
  jasmineEnzyme();
});

// function to require all modules for a given context
let requireAll = requireContext => {
  requireContext.keys().forEach(requireContext);
};

// require all js files except testHelper.js in the test folder
requireAll(require.context('./', true, /^((?!testHelper).)*\.jsx?$/));

// require all js files except main.js in the src folder
requireAll(require.context('../src/', true, /^((?!main).)*\.jsx?$/));

// output to the browser's console when the tests run
console.info(`TESTS RAN AT ${new Date().toLocaleTimeString()}`);
```

Now we can trim our test files down to this:

```javascript
// test/components/Elephant.js

import Elephant from '../../src/components/Elephant';

describe('Elephant', () => {
  let image,
      onClick,
      text,
      wrapper;

  beforeEach(() => {
    onClick = jasmine.createSpy('onClick spy');
    wrapper = mount(
      <Elephant
        image="http://fakeurl.com/elephant"
        onClick={onClick}
        text="I am an Elephant!"
      />
    );
  });

...
});
```

```javascript
// test/containers/ElephantContainer.js

import ElephantContainer from '../../src/containers/ElephantContainer';
import Elephant from '../../src/components/Elephant';

describe('ElephantContainer', () => {
  let wrapper;

  beforeEach(() => {
    spyOn(ElephantContainer.prototype, 'handleClick').and.callThrough();
    wrapper = mount(<ElephantContainer />);
  });
  ...

});
```

Nice!

## Final Files
For convenience, here are the final test files that were written in this article:

```javascript
// test/components/Elephant.js
import Elephant from '../../src/components/Elephant';

describe('Elephant', () => {
  let image,
      onClick,
      text,
      wrapper;

  beforeEach(() => {
    onClick = jasmine.createSpy('onClick spy');
    wrapper = mount(
      <Elephant
        image="http://fakeurl.com/elephant"
        onClick={onClick}
        text="I am an Elephant!"
      />
    );
  });

  it('should render an h1 tag', () => {
    expect(wrapper.find('h1')).toBePresent();
  });

  it('should render an h1 tag with the text property value', () => {
    expect(wrapper.find('h1').text()).toBe('I am an Elephant!');
  });

  it('should render an img tag with the specific props', () => {
    expect(wrapper.find('img').props()).toEqual({
      src: 'http://fakeurl.com/elephant',
      height: '400',
      width: '600'
    });
  });

  it('should invoke the onClick function from props when clicked', () => {
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});

```

```javascript
// test/containers/ElephantContainer.js
import ElephantContainer from '../../src/containers/ElephantContainer';
import Elephant from '../../src/components/Elephant';

describe('ElephantContainer', () => {
  let wrapper;

  beforeEach(() => {
    spyOn(ElephantContainer.prototype, 'handleClick').and.callThrough();
    wrapper = mount(<ElephantContainer />);
  });

  it('should have the specified initial state', () => {
    expect(wrapper.state()).toEqual({ babyElephant: false });
  })

  it('should render an Elephant Component', () => {
    expect(wrapper.find(Elephant)).toBePresent();
  });

  it('should render the Elephant Component with specific props when babyElephant is false', () => {
    expect(wrapper.find(Elephant).props()).toEqual({
      image: "https://s3.amazonaws.com/horizon-production/images/elephant_2.jpg",
      onClick: jasmine.any(Function),
      text: 'that\'s a big elephant'
    });
  });

  it('should render the Elephant Component with specific props when babyElephant is true', () => {
    wrapper.setState({ babyElephant: true });
    expect(wrapper.find(Elephant).props()).toEqual({
      image: "https://s3.amazonaws.com/horizon-production/images/elephant_1.jpg",
      onClick: jasmine.any(Function),
      text: "Look at the baby elephant!"
    })
  })

  describe('handleClick', () => {
    it('should be invoked when the onClick property of the Elephant component is called', () => {
      wrapper.find(Elephant).props().onClick();
      expect(ElephantContainer.prototype.handleClick).toHaveBeenCalled();
    });

    it('should change the babyElephant property in the state to the opposite boolean value', () => {
      wrapper.find(Elephant).props().onClick();
      expect(wrapper.state()).toEqual({ babyElephant: true });
    });
  });
});
```

## Summary
Front-end applications tend to grow in complexity quite quickly as user
interfaces become more interactive and the size of your application state
increases. Testing your React application will allow you to better handle this
complexity because they will inform you if new features have broken any existing ones. In this article, we introduced the Enzyme testing library, which has
an intuitive and flexible API that makes it easy to test React components. By
using Enzyme, you will have the ability to develop new features in the
application via Test-Driven Development and increase the maintainability of your
React application.

### External Resources
* [Enzyme Docs][enzyme-docs]
* [Enzyme Docs: Shallow Rendering API][enzyme-docs-shallow-rendering-api]
* [Enzyme Docs: Full Rendering API][enzyme-docs-full-rendering-api]
* [Jasmine Enzyme Docs][npm-jasmine-enzyme]
* [React Docs: Test Utilities][react-docs-test-utils]
* [Spies and CallThrough][spies-and-callthrough-blog]

[karma-docs]:https://karma-runner.github.io/0.13/index.html
[jasmine-docs]:https://jasmine.github.io/2.4/introduction.html
[phantomjs-docs]:http://phantomjs.org/
[enzyme-docs]: https://github.com/airbnb/enzyme
[enzyme-docs-full-rendering-api]: https://github.com/airbnb/enzyme/blob/master/docs/api/mount.md
[enzyme-docs-shallow-rendering-api]: https://github.com/airbnb/enzyme/blob/master/docs/api/shallow.md
[enzyme-docs-shallow-rendering-api-simulate]:https://github.com/airbnb/enzyme/blob/master/docs/api/ShallowWrapper/simulate.md
[enzyme-docs-full-rendering-api-find]: http://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
[enzyme-docs-full-rendering-api-props]: http://airbnb.io/enzyme/docs/api/ReactWrapper/props.html
[enzyme-docs-full-rendering-api-simulate]: http://airbnb.io/enzyme/docs/api/ReactWrapper/simulate.html
[enzyme-docs-full-rendering-api-setstate]: http://airbnb.io/enzyme/docs/api/ReactWrapper/setState.html
[enzyme-docs-full-rendering-api-state]: http://airbnb.io/enzyme/docs/api/ReactWrapper/state.html
[enzyme-docs-using-enzyme-with-webpack]: https://github.com/airbnb/enzyme/blob/master/docs/guides/webpack.md
[jasmine-docs-createspy]: https://jasmine.github.io/2.4/introduction.html#section-Spies
[jasmine-enzyme-tobepresent]: https://github.com/blainekasten/enzyme-matchers#tobepresent
[npm-jasmine-enzyme]: https://www.npmjs.com/package/jasmine-enzyme
[promise-resolve-function]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
[react-docs-test-utils]: https://facebook.github.io/react/docs/test-utils.html
[spies-and-callthrough-blog]:https://hatoum.com/blog/2016/11/12/jasmine-unit-testing-dont-forget-to-callthrough
[testing-react-components-repository]: https://github.com/amandabeiner/testing-react-components
[testing-react-components-1]: https://s3.amazonaws.com/horizon-production/images/testing-react-components-big-elephant.png
[testing-react-components-2]: https://s3.amazonaws.com/horizon-production/images/testing-react-components-baby-elephant.png
