import { useState, useRef, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

import Icon from '@material-ui/core/Icon';
import CloseIcon from '@renderer/components/svg/CloseIcon';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FourKIcon from '@material-ui/icons/FourK';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';


export default function() {
  const classes = useStyles();
  const scrollbarRef = useRef();

  const [tabs, setTabs] = useState([
    { name: 'main', text: 'Main Tab', icon: HomeIcon },
    { name: 'content', text: 'Content Tab' },
    { name: 'st1', text: 'Spare Tab 1', icon: AddCircleIcon },
    { name: 'st2', text: 'Spare Tab 2' },
    { name: 'st3', text: 'Spare Tab 3' },
    { name: 'st4', text: 'Spare Tab 4', icon: FourKIcon },
    { name: 'st5', text: 'Spare Tab 5' },
    { name: 'st6', text: 'Spare Tab 6', icon: ThreeSixtyIcon },
    { name: 'last', text: 'Last Tab' }
  ]);
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
    scrollbarRef.current.hideScrollbars();
  }, []);

  useEffect(() => {
    console.log('tabs', tabs);
  }, [tabs]);

  const moveTab = useCallback(
    (dragIndex, hoverIndex) => {
      console.log('moveTab', dragIndex, hoverIndex);
      const dragTab = tabs[dragIndex];

      setTabs(
        update(tabs, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragTab]
          ],
        }),
      );
    },
    [tabs]
  );

  const activateTab = useCallback(
    ({ name }) => {
      console.log('activateTab', name);
      setActiveTab(name);
    },
    [activeTab]
  );

  return (
    <SimpleBar 
      ref={scrollbarRef}
      forceVisible="x"
      // className2={classes.container}
      style={{ backgroundColor: '#f3f3f3' }}
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
          console.log('show  scrollbar', (new Date).getTime());
          scrollbarRef.current.showScrollbar('x');
        }}
      >
        {tabs.map(({ name, text, icon }, index) => (
          <TabItem 
            key={name} 
            index={index} 
            name={`${name}`} 
            text={text}
            icon={icon}
            active={activeTab === name}
            moveTab={moveTab}
            activateTab={activateTab}
          />
        ))}
      </div>
    </SimpleBar>
  );
}

function TabItem({
  index,
  name,
  text,
  icon: InTabIcon,
  active = false,
  closable = true,
  moveTab,
  activateTab,
  closeTab
}) {
  const classes = useTabItemStyles();
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'nav-tab',
    drop: () => ({ name, index }),
    // hover(item, monitor) {
    //   if (!ref.current) {
    //     return;
    //   }
    //   const dragIndex = item.index;
    //   const hoverIndex = index;

    //   // Don't replace items with themselves
    //   if (dragIndex === hoverIndex) {
    //     return;
    //   }

    //   // // Determine rectangle on screen
    //   // const hoverBoundingRect = ref.current.getBoundingClientRect();

    //   // // Get vertical middle
    //   // const hoverMiddleY =
    //   //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    //   // // Determine mouse position
    //   // const clientOffset = monitor.getClientOffset();

    //   // // Get pixels to the top
    //   // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    //   // // Only perform the move when the mouse has crossed half of the items height
    //   // // When dragging downwards, only move when the cursor is below 50%
    //   // // When dragging upwards, only move when the cursor is above 50%
    //   // // Dragging downwards
    //   // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //   //   return
    //   // }
    //   // // Dragging upwards
    //   // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //   //   return
    //   // }

    //   // Time to actually perform the action
    //   moveTab(dragIndex, hoverIndex)
    //   // Note: we're mutating the monitor item here!
    //   // Generally it's better to avoid mutations,
    //   // but it's good here for the sake of performance
    //   // to avoid expensive index searches.
    //   item.index = hoverIndex
    // },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    // item: { name, type: ItemTypes.BOX },
    item: { index, name, text, type: 'nav-tab' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      // if (item && dropResult) {
      //   alert(`You dropped ${item.name} into ${dropResult.name}!`)
      // }

      // if (!ref.current) {
      //   return;
      // }
      const dragIndex = item.index;
      const hoverIndex = dropResult.index;

      console.log('useDrag:end', dragIndex, hoverIndex, item);

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // // Determine rectangle on screen
      // const hoverBoundingRect = ref.current.getBoundingClientRect();

      // // Get vertical middle
      // const hoverMiddleY =
      //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset();

      // // Get pixels to the top
      // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%
      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return
      // }
      
      // Time to actually perform the action
      moveTab(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex

    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleMouseDown = event => activateTab({ name });
  const handleMouseOver = () => setHover(true);
  const handleMouseOut = () => setHover(false);
  const handleCloseClick = event => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    console.log('close tab', name, index);
    closeTab && closeTab({ index, name });
  }

  let opacity = 1
  const isActive = canDrop && isOver;

  let backgroundColor = active ? 'white' : undefined;

  if(isDragging) {
    backgroundColor = 'white';
  } else if (isActive) {
    backgroundColor = 'rgba(38, 119, 203, 0.18)';
    
  } else if (canDrop) {
    // backgroundColor = 'darkkhaki'
  }

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={classes.container}
      style={{ opacity, backgroundColor }}
    >
      {/* {!!icon && <Icon fontSize="small" color="primary">{icon}</Icon>} */}
      {InTabIcon && <InTabIcon color="primary" classes={{
        root: clsx(classes.icon, active && classes.iconActive)
      }}/>}
      <span className={classes.text}>{text}</span>
      {closable && <CloseIcon 
        onMouseDown={handleCloseClick}
        className={clsx(classes.iconClose, (active || hover) && classes.iconCloseHover)}/>
      }
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
    alignItems: 'center',
    padding: '10px 16px',
    borderLeft: '1px solid #f3f3f3',
    backgroundColor: '#ececec',
    userSelect: 'none'
  },
  text: {
    whiteSpace: 'nowrap',
    marginTop: 2,
    lineHeight: '1em',
    color: 'rgba(51, 51, 51, 0.7)'
  },
  icon: {
    marginRight: 4,
    fontSize: 18,
    opacity: .5
  },
  iconActive: {
    opacity: .8
  },
  iconClose: {
    marginLeft: 8,
    opacity: 0
  },
  iconCloseHover: {
    opacity: 1
  }

}));
