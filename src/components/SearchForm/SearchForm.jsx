import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

export default class SearchForm extends Component {
  static defaultProps = {
    onSearch: () => {},
    rated: false,
  };

  static propTypes = {
    onSearch: PropTypes.func,
    rated: PropTypes.bool,
  };

  state = {
    search: '',
  };

  onChange = (event) => {
    const { onSearch } = this.props;
    const { search } = this.state;

    this.setState({ search: event.target.value });
    onSearch(search);
  };

  render() {
    const { rated } = this.props;
    const searchFormClass = rated ? 'hidden' : 'search';

    return <Input placeholder="Type to search..." onChange={this.onChange} className={searchFormClass} />;
  }
}
