import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Popconfirm, message, Button } from 'antd';
import { history } from 'umi';
import * as Request from '../request';

export default function PageList(props: any) {
  const { query } = props.location;
  const [list, setList] = useState([]);
  const [projectInfo, setProject] = useState({ code: '' });

  const queryList = useCallback(() => {
    Request.getPages(query.id).then((data) => {
      data.success && setList(data.data);
    });
  }, []);

  useEffect(() => {
    Request.getProjectInfo(query.id).then((data) => {
      if (data.success) {
        setProject(data.data);
        setList(data.data.pages);
      }
    });
  }, []);

  const handAction = (type: 1 | 2 | 3, row?: any) => {
    switch (type) {
      case 1:
        history.push(`/pageEdit?projectId=${query.id}`);
        break;

      case 2:
        history.push(
          `/pageEdit?projectId=${row.project_id}&id=${row.id}&code=${projectInfo.code}`,
        );
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
      title: '项目Id',
      dataIndex: 'project_id',
    },
    {
      title: '页面Id',
      dataIndex: 'id',
    },
    {
      title: '页面名称',
      dataIndex: 'name',
    },
    {
      title: '页面路径',
      dataIndex: 'path',
      render: (val: string) => `/${projectInfo.code}${val}`,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (val: any, row: any) => {
        return (
          <div>
            <span className="link-span" onClick={() => handAction(2, row)}>
              编辑
            </span>
            <Popconfirm
              title="是否确认删除"
              onConfirm={() => handAction(3, row)}
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
        title="页面列表"
        extra={
          <Button type="primary" onClick={() => handAction(1)}>
            添加页面
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
