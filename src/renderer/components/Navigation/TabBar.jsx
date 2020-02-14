import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SimpleBar from 'simplebar-react';


export default function() {
  const classes = useStyles();
  const scrollbarRef = useRef();

  useEffect(() => {
    //scrollbarRef.current.hideScrollbars();
  }, []);

  return (
    <SimpleBar 
      ref={scrollbarRef}
      forceVisible="x" className2={classes.container}
      autoHide={false}
      // classNames={{
      //   horizontal: classes.sbHorizontal
      // }}
      timeout={300}
    >
      <div className={classes.tabNav}
        onWheel={(e) => {

          // console.log('onWheel', e, e.nativeEvent);
          
          // console.info('x', e.deltaX, e.nativeEvent.deltaX);
          // console.info('y', e.deltaY, e.nativeEvent.deltaY);
          // console.info('z', e.deltaZ, e.nativeEvent.deltaZ);
          // console.info('mode', e.deltaMode, e.nativeEvent.deltaMode);

          // console.log(scrollbarRef.current.contentWrapperEl);

          const delta = Math.max(-1, Math.min(1, e.nativeEvent.deltaY));

          // console.info('delta', delta);
          // console.info('scrollLeft', e.currentTarget.scrollLeft);
          
          scrollbarRef.current.contentWrapperEl.scrollLeft += (delta * 40);
        }}
        onMouseLeave={(e) => {
          console.log('hide scrollbar', (new Date).getTime());
          scrollbarRef.current.hideScrollbars();
        }}
        onMouseEnter={(e) => {
          console.log('show scrollbar', (new Date).getTime());
          scrollbarRef.current.showScrollbar('x');
        }}
      >
        <TabItem text={"Main Tab"}/>
        <TabItem text={"Content Tab"}/>
        <TabItem text={"Spare Tab 1"}/>
        <TabItem text={"Spare Tab 2"}/>
        <TabItem text={"Spare Tab 3"}/>
        <TabItem text={"Spare Tab 4"}/>
        <TabItem text={"Spare Tab 5"}/>
        <TabItem text={"Spare Tab 6"}/>
        <TabItem text={"Last Tab"}/>
      </div>
    </SimpleBar>
  );
}

function TabItem({
  text
}) {
  const classes = useTabItemStyles();

  return (
    <div className={classes.container}>
      <span className={classes.text}>{text}</span>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto'
  },
  tabNav: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f3f3f3'
  },

  sbHorizontal: {
    height: 5
  }
}));

const useTabItemStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 16px',
    borderLeft: '1px solid #f3f3f3',
    backgroundColor: '#ececec',
    userSelect: 'none'
  },
  text: {
    whiteSpace: 'nowrap',
    color: 'rgba(51, 51, 51, 0.7)'
  }
}));
