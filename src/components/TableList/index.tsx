import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { InputRef } from 'antd';
import { Input, Table, TableColumnsType, TableColumnType } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import Button from '../Button';
import theme from '../../styles/theme';

interface Props<T> {
  data: T[];
  columns: TableColumnsType<T>;
  action?: TableColumnType<T>;
}

function TableList<T, K extends keyof T>({ data, columns, action }: Props<T>) {
  const [loading, setLoading] = useState(true);

  const searchInput = useRef<InputRef>(null);

  const getColumnTitleByKey = useCallback((key: K) => columns.find((col) => col.key === key), [columns]);

  const getColumnSearchProps = (key: K): TableColumnType<T> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Pesquisar ${getColumnTitleByKey(key).title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 12, display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? `${theme.colors.primary}` : undefined }} />
    ),
    onFilter: (value, record) =>
      record[key]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const dataColumns: TableColumnsType<T> = [
    ...columns.map((col) => ({
      ...col,
      ...(col.key && getColumnSearchProps(col.key as K)),
    })),
    action,
  ];

  useEffect(() => {
    if (data) setLoading(false);

    if (loading) {
      const loader = setTimeout(() => setLoading(false), 1000);
      () => clearTimeout(loader);
    }
  }, [data, loading]);

  return (
    <Table
      className="user-table"
      columns={dataColumns as object[]}
      dataSource={data as object[]}
      scroll={{ x: 500 }}
      loading={loading}
    />
  );
}

export default TableList;
