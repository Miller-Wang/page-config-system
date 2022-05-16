import React, { useCallback, useState } from 'react';
import { Tabs, Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import * as Request from '../request';

const { TabPane } = Tabs;

interface IProps {
  value?: {
    sourcecode: string;
    less: string;
  };
  onChange?: (val: any) => void;
}

// 组件编辑器
export default function CodeEditor(props: IProps) {
  const { value, onChange } = props;

  const [curKey, setCurKey] = useState('sourcecode');

  const handleEditorChange = useCallback(
    (code: string) => {
      if (!onChange) return;
      onChange({ ...value, [curKey]: code });
    },
    [curKey, onChange],
  );

  const handleAction = useCallback(async () => {
    // @ts-ignore
    const { success, data } = await Request.codeFormat(value[curKey], curKey);
    if (!success || !onChange) return;
    handleEditorChange(data.code);
  }, [handleEditorChange, value!.sourcecode, value!.less, curKey]);

  return (
    <>
      <Tabs
        defaultActiveKey={curKey}
        onTabClick={(key) => setCurKey(key)}
        animated
      >
        <TabPane tab="组件" key="sourcecode" forceRender>
          <CodeMirror
            value={value?.sourcecode}
            theme="dark"
            height="500px"
            extensions={[javascript({ jsx: true })]}
            onChange={handleEditorChange}
          />
        </TabPane>
        <TabPane tab="样式 / less" key="less" forceRender>
          <CodeMirror
            value={value?.less}
            theme="dark"
            height="500px"
            extensions={[css()]}
            onChange={handleEditorChange}
          />
        </TabPane>
      </Tabs>
      <Button type="primary" size="small" onClick={handleAction}>
        格式化
      </Button>
      {/* <Button size="small">校验</Button> */}
    </>
  );
}
