import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import menu from './staffMenu';

function CustomMenuItem({ menu }) {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const handleClick = menu.children
    ? e => {
      setOpen(!open);
    }
    : e => {
      history.push(menu.path);
    };

  return (
    <>
      <ListItem selected={history.location.pathname === menu.path} button onClick={handleClick}>
        {menu.icon ? <ListItemIcon>{menu.icon}</ListItemIcon> : null}
        <ListItemText>
          <Typography variant="button">{menu.label}</Typography>
        </ListItemText>
        {menu.children ? <>{open ? <ExpandLess /> : <ExpandMore />}</> : null}
      </ListItem>

      {menu.children ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.children.map((child, index) => (
              <ListItem
                key={index}
                button
                selected={history.location.pathname === child.path}
                onClick={e => history.push(child.path)}
              >
                {child.icon ? <ListItemIcon>{child.icon}</ListItemIcon> : null}
                <ListItemText>
                  <Typography variant="body2">{child.label}</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Collapse>
      ) : null}
    </>
  );
}

function MyMenuItems() {
  return (
    <List>
      {menu.map((parent, index) => (
        <CustomMenuItem key={index} menu={parent} />
      ))}
    </List>
  );
}

export default withRouter(MyMenuItems);
