import React, { useEffect, useCallback, useRef } from 'react';
import { Tabs } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';

const { TabPane } = Tabs;

interface IProps {
  value?: {
    sourcecode: string;
    style: string;
    testcode?: string;
  };
  onChange?: (val: any) => void;
}

// 组件编辑器
export default function CodeEditor(props: IProps) {
  const { value, onChange } = props;

  return (
    <Tabs defaultActiveKey="code" animated>
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
  );
}
