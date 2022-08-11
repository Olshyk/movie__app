import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

export default class StarsRating extends Component {
  static defaultProps = {
    rate: () => {},
    starRate: 0,
  };

  static propTypes = {
    rate: PropTypes.func,
    starRate: PropTypes.number,
    id: PropTypes.number.isRequired,
  };

  state = {
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.starRate,
  };

  rate = (e) => {
    const { id, rate } = this.props;

    localStorage.setItem(id, JSON.stringify(e));
    this.setState({ value: e });
    rate(id, e);
  };

  render() {
    const { value } = this.state;
    const { id } = this.props;

    const stars = localStorage.getItem(id !== null) ? JSON.parse(localStorage.getItem(id)) : value;

    return <Rate allowHalf count={10} style={{ fontSize: 17 }} value={stars} onChange={this.rate} />;
  }
}
