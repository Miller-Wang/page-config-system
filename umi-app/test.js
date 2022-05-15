const str = `
function Component(props) {
  const { list = [] } = props;
  return (
    <div>
      {list.map((v, i) =>(<li key={i}>{v}</li>))}
    </div>
  );
}

`;

const reg = /(?:\/\*[\s\S]*?\*\/|\/\/.*?\r?\n|[^{])+\{([\s\S]*)\}/;

const res = str.match(reg);

console.log(res);

// const reg = /\{/;

// console.log(str.match(reg));

// console.log(reg.test(str));

`"function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function Test(props) {
  const {
    React,
    Component
  } = props.React;
  return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
    list: ['第一']
  }));
}"`;

const a = '12222333';
const fn = eval(`(function A(){

})()`);

console.log(fn);
