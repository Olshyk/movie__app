import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

import { GenresConsumer } from '../../services/context';

export default class Genres extends Component {
  static defaultProps = {
    genreIds: [],
    genreArray: [],
    rated: false,
  };

  static propTypes = {
    genreIds: PropTypes.instanceOf(Array),
    genreArray: PropTypes.instanceOf(Array),
    rated: PropTypes.bool,
  };

  getGenreNames = (commonArr, arr) => {
    const { genreArray, rated } = this.props;
    if (rated) return genreArray.map((item) => item.name);

    const filtered = commonArr.filter((item) => arr.includes(item.id));
    return filtered.map((item) => item.name);
  };

  render() {
    const { genreIds } = this.props;
    return (
      <GenresConsumer>
        {(value) => (
          <div className="genres">
            <Tag>{this.getGenreNames(value, genreIds)[0]}</Tag>
            <Tag style={genreIds.length < 2 ? { display: 'none' } : { display: 'inline-block' }}>
              {this.getGenreNames(value, genreIds)[1]}
            </Tag>
            <Tag style={genreIds.length < 3 ? { display: 'none' } : { display: 'inline-block' }}>
              {this.getGenreNames(value, genreIds)[2]}
            </Tag>
            <Tag style={genreIds.length < 4 ? { display: 'none' } : { display: 'inline-block' }}>
              {this.getGenreNames(value, genreIds)[3]}
            </Tag>
          </div>
        )}
      </GenresConsumer>
    );
  }
}
