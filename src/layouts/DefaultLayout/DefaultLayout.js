import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import SendIcon from '@material-ui/icons/Send';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Grid, ButtonBase } from '@material-ui/core';
import clsx from 'clsx';
import Box from '@material-ui/core/Box'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MainContent from './MainContent';
import MyMenuItem from './MyMenuItem';
import StaffUserContent from './StaffUserContent';
import StaffUserMenuItem from './StaffUserMenuItem'
import { fetchUserThunk } from 'ducks/userSlice';
import { LinearProgress } from '@material-ui/core';
import logo from 'icons/app_logo.png';
const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'start',
    padding: theme.spacing(0, 0),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


function DefaultLayout(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const issuper = localStorage.getItem('is_superuser');
  const dispatch = useDispatch();

  console.log(issuper)


  useEffect(() => {
    dispatch(fetchUserThunk());
  }, []);

  const userState = useSelector(state => state.shared.user);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }


  function handleMenu(event) {
    setIsMenuOpen(!isMenuOpen);
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    localStorage.clear('token');
    window.location.reload();
  }
  if (userState.isLoading) {
    return <LinearProgress />
  }

  if (userState.error) {
    return (
      <Box color='red' m={3}>
        {userState.error}
      </Box>
    );
  }
  const drawer = (
    <div>
      <div className={classes.header} style={{ padding: 16 }}>
        <Box p={2}>
          <Box pb={1}>
            <Grid container alignItems='center' spacing={1}>
              <Grid item>
                <img src={logo} height={32} width={32} />
              </Grid>
              <Grid item>
                {userState.data.is_superuser
                  ? <Typography variant='h6'>Super Admin</Typography>
                  : <Typography variant='h6'>Staff User</Typography>}

              </Grid>
            </Grid>
          </Box>
          <Typography variant='h6'>{userState.data.full_name}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {userState.data.email}
          </Typography>
        </Box>
      </div>
      <Divider />
      {userState.data.is_superuser
        ? <MyMenuItem />
        : <StaffUserMenuItem />
      }
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="end"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Box component='div'>
            <Grid container >
              <Grid item className={classes.logo_text}>
                <Typography variant="h6" style={{ color: 'white' }} noWrap>
                  Our Print
          </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box flexGrow={1}></Box>
          <div className={classes.grow} />
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              style={{ color: 'white' }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              open={isMenuOpen}
              onClose={handleClose}
            >{userState.data.is_superuser
              ? <MenuItem>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>

                <Typography noWrap onClick={() => props.history.push(`/update_password`)} >
                  Update Password
              </Typography>
              </MenuItem> : null}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <PowerIcon />
                </ListItemIcon>
                <Typography noWrap>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </div>

        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div style={{ position: 'relative' }}>
          <IconButton style={{
            position: 'absolute',
            top: 0,
            right: 0,
            margin: 8,
          }} onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />

        {drawer}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Box p={2}>
          {
            userState.data.is_superuser ? <MainContent />
              : <StaffUserContent />
          }
        </Box>
      </main>
    </div>
  );
}

export default DefaultLayout;