import React from 'react';
import { Spin } from 'antd';

import * as styled from './styles';

function Loader() {
  return (
    <styled.Loader>
      <div className="spin">
        <Spin size="large" />
      </div>
    </styled.Loader>
  );
}

export default Loader;
