import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';


export default function({
  title,
  subtitle,
  icon: Icon,
  disabled = false,
  className,
  classes = {},
  children,
  ...rest
}) {
  const localClasses = useStyles({ disabled });

  return (
    <div className={clsx(localClasses.root, classes.root, className)}>
      <ButtonBase
        disabled={disabled}
        focusRipple
        className={clsx(localClasses.button, classes.button)}
        {...rest}
      >
        <div className={localClasses.content}>
          <div className={clsx(localClasses.header, classes.header)}>
            {Icon && <Icon 
              fontSize="inherit" 
              classes={{
                root: clsx(localClasses.icon, classes.icon)
              }}
            />}
            <div className={localClasses.titleContainer}>
              <span className={clsx(localClasses.title, classes.title)}>
                {title}
              </span>
              {!!subtitle && (
                <span className={clsx(localClasses.subtitle, classes.subtitle)}>
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          {!!children && children.length && (
            <div className={clsx(localClasses.body, classes.content)}>
              {children}
            </div>
          )}
        </div>
      </ButtonBase>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    opacity: ({ disabled }) => disabled ? .5 : 1
  },
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center'
  },
  body: {
    flex: 1
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  button: {
    display: 'flex',
  },
  titleContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    textAlign: 'left',
    // alignItems: 'center'
  },
  title: {
  },
  subtitle: {
    marginTop: theme.spacing(.5),
    fontSize: '.8rem',
    color: theme.palette.text.secondary
  },
  icon: {

  }
}));
