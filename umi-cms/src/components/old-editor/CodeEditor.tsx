import React, { useEffect, useCallback, useRef } from 'react';
import { Tabs } from 'antd';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './codemirror.less';

// 主题
import 'codemirror/theme/ayu-dark.css';
// 语言模式
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/javascript/javascript.js';

// ------------addon-------------
// 语法高亮
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint.js';

// dialog
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';

// 支持搜索 https://codemirror.net/demo/search.html
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/jump-to-line.js';

// (){} 自动补全
import 'codemirror/addon/edit/closebrackets.js';

// 开始结束标签 匹配自动闭合
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/edit/closetag.js';

// 代码折叠
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

// 代码注释
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/comment/continuecomment.js';

// 代码检查 只支持js，不支持jsx
import 'codemirror/addon/lint/lint.css';
// @ts-ignore
import jshint from 'jshint';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/html-lint.js';

// @ts-ignore
window.JSHINT = jshint.JSHINT;

// 全屏
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

// css编辑器
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/display/autorefresh.js';
// @ts-ignore
import csshint from 'csslint';

// @ts-ignore
window.CSSLint = csshint.CSSLint;

const { TabPane } = Tabs;

// value onChange
// 组件编辑器
export default function CodeEditor(props: any) {
  const { value, onChange } = props;
  const codeEditorRef = useRef({});
  const styleEditorRef = useRef({});

  // 代码
  const initCodeEditor = useCallback((ele) => {
    return CodeMirror.fromTextArea(ele, {
      lineNumbers: true,
      tabSize: 2,
      extraKeys: {
        Ctrl: 'autocomplete',
        F5: (cm) => {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        Esc: function (cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
        },
      },
      mode: { name: 'jsx' },
      theme: 'ayu-dark',
      autoCloseBrackets: true,
      autoCloseTags: true,
      matchTags: { bothTags: true },
      // 代码折叠
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers',
      ],
      // continueComments: {
      //   continueLineComment: true,
      // },

      // 代码检查
      lint: { options: { esversion: 2021, tooltips: true } },

      maxHighlightLength: 200,
      spellcheck: true,
      autocorrect: true,
      flattenSpans: true,
    });
  }, []);

  // 样式
  const initStyleEditor = useCallback((ele) => {
    return CodeMirror.fromTextArea(ele, {
      lineNumbers: true,
      tabSize: 2,
      extraKeys: {
        Ctrl: 'autocomplete',
        F5: (cm) => {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        Esc: function (cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
        },
      },
      mode: 'css',
      theme: 'ayu-dark',
      autoCloseBrackets: true,
      autoCloseTags: true,
      matchTags: { bothTags: true },
      // 代码折叠
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers',
      ],
      lint: true,
      maxHighlightLength: 200,
      spellcheck: true,
      autocorrect: true,
      flattenSpans: true,
    });
  }, []);

  useEffect(() => {
    const codeEditor = initCodeEditor(document.getElementById('code-editor'));
    const styleEditor = initStyleEditor(
      document.getElementById('style-editor'),
    );

    codeEditor.on('change', () => {
      const code = codeEditor.getValue();
      if (onChange) {
        onChange({
          ...value,
          component: code,
        });
      }
    });
    styleEditor.on('change', () => {
      const styleCode = styleEditor.getValue();
      if (onChange) {
        onChange({
          ...value,
          style: styleCode,
        });
      }
    });

    codeEditorRef.current = codeEditor;
    styleEditorRef.current = styleEditor;
  }, []);

  return (
    <Tabs defaultActiveKey="js" animated>
      <TabPane tab="代码" key="js" forceRender>
        <textarea id="code-editor" defaultValue={value.component} />
      </TabPane>
      <TabPane tab="样式/css" key="style" forceRender>
        <textarea id="style-editor" defaultValue={value.style} />
      </TabPane>
    </Tabs>
  );
}
