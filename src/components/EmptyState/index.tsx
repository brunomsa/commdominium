import React from 'react';
import { Empty } from 'antd';

function EmptyState() {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhum dado encontrado" />;
}

export default EmptyState;
