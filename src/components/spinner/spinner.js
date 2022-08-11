import React from 'react';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import './spinner.css';

function Spinner() {
  return (
    <div className="example">
      <Spin size="large" />
    </div>
  );
}

export default Spinner;
