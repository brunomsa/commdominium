import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { SetStateAction, useEffect } from 'react';
import { MenuOptionsType } from '../../utils/types';

import * as styled from './styles';

interface Props {
  options: MenuOptionsType[];
  menuVisibility: boolean;
  setMenuVisibility: React.Dispatch<SetStateAction<boolean>>;
  onClick: (key: string) => void;
}

function MobileMenu({ options, menuVisibility, setMenuVisibility, onClick }: Props) {
  useEffect(() => {
    document.body.style.overflowY = menuVisibility ? 'hidden' : 'auto';
  }, []);

  return (
    <styled.MobileMenu menuVisibility={menuVisibility}>
      <Button icon={<CloseOutlined />} onClick={() => setMenuVisibility(false)} />
      <nav>
        {options.filter(Boolean).map((op) => (
          <a
            key={op.key}
            onClick={() => {
              setMenuVisibility(false);
              onClick(op.key);
            }}
          >
            {op.label}
          </a>
        ))}
      </nav>
    </styled.MobileMenu>
  );
}

export default MobileMenu;
