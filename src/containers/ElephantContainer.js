import React, { Component } from 'react';
import Elephant from '../components/Elephant';

class ElephantContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { babyElephant: false };
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick() {
    let nextBabyElephant = !this.state.babyElephant;
    this.setState({ babyElephant: nextBabyElephant });
  }

  render() {
    let image, text;

    if (this.state.babyElephant) {
      image = 'https://s3.amazonaws.com/horizon-production/images/elephant_1.jpg';
      text = 'Look at the baby elephant!';
    } else {
      image = 'https://s3.amazonaws.com/horizon-production/images/elephant_2.jpg';
      text = 'that\'s a big elephant';
    }

    return (
      <div>
        <Elephant
          image={image}
          onClick={this.handleClick}
          text={text}
        />
      </div>
    );
  }
}

export default ElephantContainer;
