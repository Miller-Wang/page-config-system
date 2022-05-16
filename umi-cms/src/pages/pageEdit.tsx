import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, message, Input, Form, Button } from 'antd';
import { history } from 'umi';
import * as Request from '../request';
import CodeEditor from '@/components/CodeEditor';
import IFrame from '@/components/IFrame/index';
import { DEFAULT_PAGE } from '@/constants';

// 搭建应用 域名
const PREFIX = 'http://localhost:8001';

export default function PageEdit(props: any) {
  const { query } = props.location;
  const formRef = useRef<any>();
  const iframeRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [detail, setDetail] = useState<any>({
    editorValue: { sourcecode: DEFAULT_PAGE, style: '' },
  });
  const [showPreview, setShowPreview] = useState(!!query.id);

  useEffect(() => {
    if (query.id) {
      setLoading(true);
      Request.getPageDetail(query.id).then((data) => {
        if (data.success) {
          const { sourcecode, style = '' } = data.data;
          data.data.editorValue = { sourcecode, style };
          setDetail(data.data);
        }
        setLoading(false);
      });
    }
  }, []);

  const onFinish = async (values: any) => {
    const { sourcecode, style } = values.editorValue;
    delete values.editorValue;
    const params = {
      ...values,
      pathname: `/${query.code}${values.path}`,
      sourcecode,
      style,
    };

    try {
      setSaveLoading(true);
      if (!query.id) {
        const res = await Request.addPage(query.projectId, params);
        res.success && history.replace(`/pageList?id=${query.projectId}`);
        return;
      }
      const res = await Request.updatePage(query.projectId, query.id, params);
      if (res.success) {
        message.success('保存成功');
        // 刷新预览
        iframeRef.current.refresh();
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.warn(error);
      message.error('保存失败');
    }
    setSaveLoading(false);
  };

  const rules = [{ required: true, message: '请输入' }];

  const previewUrl = `${PREFIX}/${query.code}${detail.path}`;

  return (
    <Card
      title="页面编辑"
      loading={loading}
      extra={
        <Button
          size="small"
          type="primary"
          onClick={() => setShowPreview(true)}
          disabled={!query.id}
        >
          预览
        </Button>
      }
    >
      <Form initialValues={detail} onFinish={onFinish} ref={formRef}>
        <Form.Item label="页面名称" name="name" required rules={rules}>
          <Input />
        </Form.Item>

        <Form.Item label="页面路径" name="path" required rules={rules}>
          <Input />
        </Form.Item>

        <Form.Item label="页面描述" name="desc" required rules={rules}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="页面代码" name="editorValue" required rules={rules}>
          <CodeEditor />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            onClick={() => history.replace(`/pageList?id=${query.projectId}`)}
            style={{ marginRight: 15 }}
          >
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={saveLoading}>
            保存
          </Button>
        </Form.Item>
      </Form>
      <IFrame
        ref={iframeRef}
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        previewUrl={previewUrl}
      />
    </Card>
  );
}
