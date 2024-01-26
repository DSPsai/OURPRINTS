import React from 'react';
import { Grid, Typography } from '@material-ui/core'

function CustomComponent({ title, value, data,size }) {
  return <Grid item xs={size}>
    <Typography
      color="textSecondary"
      gutterBottom
      variant="body2"
    >
      {title}
    </Typography>
    <Typography variant="button">
      {value ? value : '---'}
    </Typography>
  </Grid>
}
export default CustomComponent;