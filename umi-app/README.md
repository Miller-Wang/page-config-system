# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```js
const FnTest = new Function(
  "props",
  `
  React.useEffect(() => {
    console.log('组件挂载');
  }, []);
  return /*#__PURE__*/React.createElement("h1", null, props.title);
  `
);

window.React = React;

function Test(props) {
  React.useEffect(() => {
    console.log("组件挂载");
  }, []);
  return <h1>{props.title}</h1>;
}

function App() {
  return (
    <div className="App">
      <h1>hello</h1>
      <FnTest title="这是标题" />
    </div>
  );
}
```
