import React from 'react';

import { Empty } from 'antd';

interface Props {
  description?: string;
}

function EmptyState({ description }: Props) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description ?? 'Nenhum dado encontrado'} />;
}

export default EmptyState;
