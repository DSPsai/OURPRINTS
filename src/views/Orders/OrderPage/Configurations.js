import React from 'react';
import { Grid, Typography, Button, Card, CardContent, Box } from '@material-ui/core';
import _ from 'lodash';
import { useRouteMatch, Link } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';

function Configurations({ data }) {
  return <Grid container spacing={2}>
    <Grid item xs={12}>
      {data ? <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {"Configurations Info"}
      </Typography>
        : null}
    </Grid>
    {
      data.config_list ? JSON.parse(data.config_list).map((item, index) => (
        <Grid item xs={6} key={index}>
          <div style={{ border: '1px solid #388E3C', borderRadius: 16 }}>
            <Grid spacing={4} style={{ padding: 16 }} container justify="space-between">
              <Grid item xs={6}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  {"Title"}
                </Typography>
                <Typography variant="button">
                  {item.title}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  {"Type"}
                </Typography>
                <Typography variant="button">
                  {item.type}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  {"Price"}
                </Typography>
                <Typography variant="button">
                  {item.price}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  {"Price type"}
                </Typography>
                <Typography variant="button">
                  {item.price_type}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      )) : null
    }
  </Grid>
}

export default Configurations;