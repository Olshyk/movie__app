import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

import { GenresConsumer } from '../../services/context';

export default class Genres extends Component {
  static defaultProps = {
    genreIds: [],
  };

  static propTypes = {
    genreIds: PropTypes.instanceOf(Array),
  };

  getGenreNames = (commonArr, arr) => {
    const filtered = commonArr.filter((el) => arr.includes(el.id));
    return filtered.map((el) => el.name);
  };

  render() {
    const { genreIds } = this.props;
    return (
      <GenresConsumer>
        {(value) => {
          return (
            <>
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
            </>
          );
        }}
      </GenresConsumer>
    );
  }
}
