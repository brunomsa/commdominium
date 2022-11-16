import React from 'react';

import { Spin } from 'antd';

import * as styled from './styles';

function PageLoader() {
  return (
    <styled.PageLoader>
      <div className="spin">
        <Spin size="large" />
      </div>
    </styled.PageLoader>
  );
}

export default PageLoader;
