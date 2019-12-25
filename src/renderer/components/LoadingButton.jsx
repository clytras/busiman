import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const DefaultLoadingIconSize = 20;

export default function({
  startIcon,
  children,
  loading,
  disabled,
  loadingIconSize,
  ...rest
}) {
  if(!loadingIconSize && 'size' in rest) {
    loadingIconSize = rest.size === 'small' ? 18 : DefaultLoadingIconSize;
  } else {
    loadingIconSize = DefaultLoadingIconSize;
  }

  return (
    <Button startIcon={loading ? <CircularProgress size={loadingIconSize}/> : startIcon} {...rest} disabled={disabled || loading}>
      {/* {loading && <CircularProgress size={20} color="inherit" />} */}
      {children}
    </Button>
  )
}
