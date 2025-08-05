/* eslint-disable react/display-name */
import React from 'react';

type LoadingProps = React.HTMLProps<HTMLDivElement>;
const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
  return (
    <div id="b-loading" className="b-loading" ref={ref}>
      <div></div>
      <div></div>
    </div>
  );
});

export default Loading;
