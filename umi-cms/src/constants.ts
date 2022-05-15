export const DEFAULT_COMPONENT = `
function Component(props) {
  return (
    <div>
    </div>
  );
}`;

export const DEFAULT_COMPONENT_TEST = `
function Test({ Component, ...props }) {
  return (
    <Component {...props}>
    </Component>
  );
}`;
