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
    style: string;
  };
  onChange?: (val: any) => void;
}

// 组件编辑器
export default function CodeEditor(props: IProps) {
  const { value, onChange } = props;

  const [curKey, setCurKey] = useState('code');

  const handleAction = useCallback(async () => {
    const { success, data } = await Request.codeFormat(value!.sourcecode);
    if (!success || !onChange) return;
    onChange({
      ...value,
      sourcecode: data.code,
    });
  }, []);

  return (
    <>
      <Tabs defaultActiveKey={curKey} onTabClick={(key) => setCurKey(key)} animated >
        <TabPane tab="组件" key="code" forceRender>
          <CodeMirror
            value={value?.sourcecode}
            theme="dark"
            height="500px"
            extensions={[javascript({ jsx: true })]}
            onChange={(code, viewUpdate) => {
              if (!onChange) return;
              onChange({
                ...value,
                sourcecode: code,
              });
            }}
          />
        </TabPane>
        <TabPane tab="CSS" key="style" forceRender>
          <CodeMirror
            value={value?.style}
            theme="dark"
            height="500px"
            extensions={[css()]}
            onChange={(code, viewUpdate) => {
              if (!onChange) return;
              onChange({
                ...value,
                style: code,
              });
            }}
          />
        </TabPane>
      </Tabs>
      <Button type='primary' size='small' onClick={handleAction}>格式化</Button>
      <Button size='small'>校验</Button>
    </>
  );
}
