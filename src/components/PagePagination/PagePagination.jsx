import React, { Component } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

export default class PagePagination extends Component {
  static defaultProps = {
    page: 1,
    query: 'return',
    onChange: () => {},
    totalPages: 1,
  };

  static propTypes = {
    page: PropTypes.number,
    query: PropTypes.string,
    onChange: PropTypes.func,
    totalPages: PropTypes.number,
  };

  state = {
    current: this.props.page,
  };

  componentDidUpdate(prevProps) {
    const { query } = this.props;

    if (prevProps.query !== query) {
      this.setState({ current: 1 });
    }
  }

  onChange = (page) => {
    const { onChange } = this.props;

    this.setState({ current: page });
    onChange(page);
    window.scrollTo(0, 0);
  };

  render() {
    const { totalPages } = this.props;
    const { current } = this.state;

    return (
      <Pagination
        defaultCurrent={1}
        current={current}
        onChange={this.onChange}
        hideOnSinglePage
        responsive
        size="small"
        total={totalPages}
        pageSize={20}
      />
    );
  }
}
