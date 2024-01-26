import React, { useState } from 'react';
import { Drawer, AppBar, Toolbar, Typography, IconButton, Box, Grid, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'start',
    padding: theme.spacing(0, 0),
    ...theme.mixins.toolbar,
  },
}));

export default function withDrawer(Component) {

  return function (props) {
    const classes = useStyles();

    return (
      <Drawer anchor="right" open={props.open} onClose={() => { }}>
        <Box position="relative">
          <AppBar position="absolute">
            <Toolbar>
              <Typography variant="h6">{props.title || ''}</Typography>
              <div style={{ flexGrow: 1 }} />
              <IconButton color="inherit" onClick={() => props.setOpen(false)} >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box width="540px" p={3}>
            <Grid container>
              <Grid item xs={12}>
                <div className={classes.drawerHeader} />
                <Component {...props} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    )
  }
}