import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  useEffect,
} from 'react';
import { Input } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RedoOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './style.less';

interface IProps {
  visible: boolean;
  onClose: () => void;
  previewUrl: string;
}

function IFrame(props: IProps, ref: any) {
  const { visible, onClose, previewUrl } = props;
  const iframeRef = useRef<any>();
  const [jumpUrl, setJumpUrl] = useState(previewUrl);
  const [url, setUrl] = useState(previewUrl);
  const [, forceUpdate] = useState({});

  const handleBack = useCallback(() => {
    iframeRef.current.contentWindow.postMessage({ type: 'back' }, '*');
  }, []);

  const handleGo = useCallback(() => {
    iframeRef.current.contentWindow.postMessage({ type: 'go' }, '*');
  }, []);

  // 刷新事件
  const handleRefresh = useCallback(() => {
    iframeRef.current.contentWindow.postMessage({ type: 'refresh' }, '*');
  }, []);

  useEffect(() => {
    // 处理iframe前进后退
    window.addEventListener('message', function (event) {
      const { data } = event;
      switch (data.type) {
        case 'changeUrl':
          const urlObj = new URL(url);
          urlObj.pathname = data.payload;
          setUrl(urlObj.toString());
          break;
      }
    });
  }, []);

  // 对外暴露方法
  useImperativeHandle(
    ref,
    () => ({
      refresh: handleRefresh,
    }),
    [],
  );

  const onUrlSearch = useCallback(
    (val) => {
      const lastUrl = /https?:\/\//.test(val) ? val : 'http://' + val;
      // 如果iframe两次设置的url一致，是不会重新刷新的
      setJumpUrl('');
      setTimeout(() => setJumpUrl(lastUrl));
    },
    [url],
  );

  return (
    <div
      className="iframe-preview"
      style={{ display: visible ? 'block' : 'none' }}
    >
      {/* 导航栏, 前进 后退 刷新 输入地址 */}
      <div className="navigator">
        <ArrowLeftOutlined onClick={handleBack} />
        <ArrowRightOutlined onClick={handleGo} />
        <RedoOutlined onClick={handleRefresh} />
        <Input.Search
          placeholder="请输入地址"
          allowClear
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onSearch={onUrlSearch}
          style={{ width: 304 }}
        />
        <CloseOutlined onClick={onClose} />
      </div>
      <iframe src={jumpUrl} ref={iframeRef} />
    </div>
  );
}

export default React.forwardRef(IFrame);
