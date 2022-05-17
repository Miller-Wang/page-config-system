import React, { useCallback, useState } from 'react';
import { Tabs, Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript, esLint } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { linter } from '@codemirror/lint';
// @ts-ignore
import Linter from 'eslint4b-prebuilt';
import * as Request from '../request';

const { TabPane } = Tabs;

interface IProps {
  value?: {
    sourcecode: string;
    less: string;
    model?: string;
  };
  onChange?: (val: any) => void;
  // 显示model
  showModel?: boolean;
}

// 组件编辑器
export default function CodeEditor(props: IProps) {
  const { value, onChange, showModel } = props;

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
            extensions={[
              javascript({ jsx: true }),
              linter(esLint(new Linter())),
            ]}
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
        {showModel && (
          <TabPane tab="Model" key="model" forceRender>
            <CodeMirror
              value={value?.model}
              theme="dark"
              height="500px"
              extensions={[javascript(), linter(esLint(new Linter()))]}
              onChange={handleEditorChange}
            />
          </TabPane>
        )}
      </Tabs>
      <Button type="primary" size="small" onClick={handleAction}>
        格式化
      </Button>
    </>
  );
}
