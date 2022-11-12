import React, { PropsWithChildren } from 'react';

import { Upload as AntdUpload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';
import theme from '../../styles/theme';

const getBase64 = (file: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(file);
};

interface Props {
  uploadProps?: UploadProps;
  drag?: boolean;
  onChange?: (file?: string) => void;
}

function Upload({ children, uploadProps, drag, onChange }: PropsWithChildren<Props>) {
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') return;
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        onChange?.(url);
      });
    }
  };

  const props = {
    ...uploadProps,
    maxCount: 1,
    onChange: handleChange,
    onRemove: () => onChange?.(),
    progress: {
      strokeColor: {
        '0%': theme.colors.light_blue,
        '100%': theme.colors.green,
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return !drag ? (
    <AntdUpload {...props}>{children}</AntdUpload>
  ) : (
    <AntdUpload.Dragger {...props}>{children}</AntdUpload.Dragger>
  );
}

export default Upload;
