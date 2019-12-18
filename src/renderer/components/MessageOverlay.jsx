import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';


export default function({
  show: inShow = true,
  type = 'info',
  icon = 'default',
  title,
  message,

  dismissable = false
}) {
  const classes = useStyles({ type, icon });
  const [visible, setVisible] = useState(inShow);

  useEffect(() => setVisible(inShow), [inShow]);

  const handleDismiss = () => setVisible(false);

  return visible && (
    <div className={classes.container}>
      <div className={classes.content}>
        {icons.selectIcon(icon, type, classes.icon)}
        <div className={clsx(classes.messageContainer, 'MenuCopyText')}>
          {(!!title || dismissable) && (
            <div className={classes.header}>
              {!!title && (
                <Typography classes={{ root: classes.messageTitle }} variant="h6" component="h6">
                  {title.trim()}
                </Typography>
              )}
              {dismissable && (
                <IconButton classes={{ root: classes.headerIconButton }} onClick={handleDismiss} size="small" aria-label="close">
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              )}
            </div>
          )}
          {!!message && (
            <Typography classes={{ root: classes.messageText }} variant="body2" component="p">
              {message.trim()}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}

const colors = {
  info: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.75)',
    borderColor: '#00b8ff'
  },
  success: {
    backgroundColor: 'hsla(116, 75%, 94%, 0.75)',
    borderColor: '#04ff00'
  },
  warning: {
    backgroundColor: 'hsla(58, 100%, 89%, 0.75)',
    borderColor: 'yellow'
  },
  error: {
    backgroundColor: 'hsla(0, 100%, 89%, 0.75)',
    borderColor: 'red'
  }
}

const icons = {
  info: () => <InfoIcon fontSize="inherit"/>,
  success: () => <CheckCircleIcon fontSize="inherit"/>,
  question: () => <HelpIcon fontSize="inherit"/>,
  warning: () => <WarningIcon fontSize="inherit"/>,
  error: () => <ErrorIcon fontSize="inherit"/>,

  selectIconColor: (icon, type) => {
    let result = 'inherit';

    if(icon) {
      if(icon in colors) {
        result = colors[icon].borderColor;
      } else if(icon === 'default' && type in colors) {
        result = colors[type].borderColor;
      } else if(icon === 'question') {
        result = colors['info'].borderColor;
      }
    }

    return result;
  },

  selectIcon: (icon, type, className) => {
    let _icon;

    if(!icon) {
      return null;
    }

    if(icon in icons) {
      _icon = icons[icon];
    }

    if(icon === 'default' && type in icons) {
      _icon = icons[type];
    }

    if(_icon) {
      return (
        <div className={className}>
          {_icon()}
        </div>
      );
    }
  }
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#0000007d'
  },
  content: ({ type }) => ({
    flex: 1,
    display: 'flex',
    margin: theme.spacing(1),
    borderRadius: 6,
    boxShadow: '0 0 10px',
    borderWidth: 2,
    borderStyle: 'solid',
    ...colors[type]
  }),

  icon: {
    color: ({ type, icon }) => icons.selectIconColor(icon, type),
    margin: theme.spacing(0, 2),
    fontSize: '50pt',
    filter: 'drop-shadow(0px 0px 5px rgba(0, 0, 0, .4))'
  },

  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerIconButton: {
    width: 24,
    height: 24,
    marginRight: theme.spacing(1)
  },
  messageContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing(1, 0),
  },
  messageTitle: {

  },
  messageText: {
    overflow: 'auto',
    whiteSpace: 'pre-line'
  }
}));
