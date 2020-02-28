import React from 'react'

export default ({
  width = 10,
  height = 10,
  color = 'rgba(0,0,0,.5)',
  ...rest
}) => (
  <svg width={width} height={height} viewBox="0 0 11 11" {...rest}>
    <path d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill={color}/>
  </svg>
);
