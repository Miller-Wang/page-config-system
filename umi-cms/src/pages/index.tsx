import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Table,
  Card,
  Popconfirm,
  message,
  Button,
  Modal,
  Form,
  Input,
} from 'antd';
import { history } from 'umi';

import * as Request from '../request';

export default function Home(props: any) {
  const formRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [editRow, setEditRow] = useState<any>();

  const queryList = useCallback(() => {
    Request.getProjects().then((data) => {
      data.success &&
        setProjects(data.data.filter((v: any) => v.code !== 'components'));
    });
  }, []);

  useEffect(() => {
    queryList();
  }, []);

  const handleAction = (type: 1 | 2 | 3 | 4, row: any) => {
    switch (type) {
      case 1:
        history.push(`/pageList?id=${row.id}`);
        break;

      case 2:
        setEditRow(row);
        break;

      case 3:
        Request.delProject(row.id).then((data) => {
          if (data.success) {
            message.success('删除成功');
            queryList();
          }
        });
    }
  };

  const onFinish = async () => {
    try {
      // @ts-ignore
      const values = await formRef.current.validateFields();
      let res;
      if (editRow.id) {
        res = await Request.updateProject({ ...editRow, ...values });
      } else {
        res = await Request.addProject(values);
      }
      if (!res.success) {
        message.error(res.msg);
        return;
      }
      setEditRow(undefined);
      queryList();
    } catch (error) {
      console.warn(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目code',
      dataIndex: 'code',
    },
    {
      title: '项目描述',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (val: any, row: any) => {
        return (
          <div>
            <span className="link-span" onClick={() => handleAction(1, row)}>
              查看
            </span>
            <span className="link-span" onClick={() => handleAction(2, row)}>
              编辑
            </span>
            <Popconfirm
              title="是否确认删除"
              onConfirm={() => handleAction(3, row)}
            >
              <span className="link-span danger">删除</span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const rules = [{ required: true, message: '请输入' }];
  return (
    <div>
      <Card
        title="项目列表"
        extra={
          <Button type="primary" onClick={() => setEditRow({})}>
            添加
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={projects} />
      </Card>
      <Modal
        title="添加/编辑项目"
        visible={editRow}
        destroyOnClose
        onCancel={() => setEditRow(undefined)}
        onOk={onFinish}
      >
        <Form initialValues={editRow} ref={formRef}>
          <Form.Item label="项目名称" name="name" required rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="项目code" name="code" required rules={rules}>
            <Input />
          </Form.Item>
          <Form.Item label="项目描述" name="desc" required rules={rules}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
