import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

function AlertMessage({ online, movies }) {
  AlertMessage.defaultProps = {
    online: false,
    movies: [],
  };

  AlertMessage.propTypes = {
    online: PropTypes.bool,
    movies: PropTypes.instanceOf(Array),
  };

  if (movies.length === 0) return <Alert message="No results" description="Look for something else" type="info" />;

  return online ? (
    <Alert message="Oops..." description="Something has gone wrong. Try to reload page" type="error" />
  ) : (
    <Alert message="You're offline" description="Check your Internet connection" type="warning" />
  );
}

export default AlertMessage;
