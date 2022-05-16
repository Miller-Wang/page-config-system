import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Popconfirm, message, Button } from 'antd';
import { history } from 'umi';
import * as Request from '../request';

export default function PageList(props: any) {
  const { query } = props.location;
  const [list, setList] = useState([]);
  const [projectInfo, setProject] = useState({ code: '' });

  const queryList = useCallback(() => {
    Request.getPages('5').then((data) => {
      data.success && setList(data.data);
    });
  }, []);

  useEffect(() => {
    Request.getProjectInfo('5').then((data) => {
      if (data.success) {
        setProject(data.data);
        setList(data.data.pages);
      }
    });
  }, []);

  const handleAction = (type: 1 | 2 | 3, row?: any) => {
    switch (type) {
      case 1:
        history.push(`/componentEdit?projectId=5`);
        break;

      case 2:
        history.push(`/componentEdit?projectId=5&code=components&id=${row.id}`);
        break;

      case 3:
        Request.delPage(row.id).then((data) => {
          if (data.success) {
            message.success('删除成功');
            queryList();
          }
        });
        break;
    }
  };

  const columns = [
    {
      title: '组件ID',
      dataIndex: 'id',
    },
    {
      title: '组件名称',
      dataIndex: 'name',
    },
    {
      title: '组件路径',
      dataIndex: 'path',
      render: (val: string) => `/components${val}`,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (val: any, row: any) => {
        return (
          <div>
            <span className="link-span" onClick={() => handleAction(2, row)}>
              编辑
            </span>
            <Popconfirm
              title="删除前请确认删除引用该组件的代码？"
              onConfirm={() => handleAction(3, row)}
            >
              <span className="link-span danger">删除</span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Card
        title="组件列表"
        extra={
          <Button type="primary" onClick={() => handleAction(1)}>
            添加组件
          </Button>
        }
      >
        <Table
          rowKey="id"
          pagination={false}
          columns={columns}
          dataSource={list}
        />
      </Card>
    </div>
  );
}
