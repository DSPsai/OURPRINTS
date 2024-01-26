import React from 'react'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Welcome() {
  return (
    <div >
      <Grid container
        id="grid-container"
        direction="column"
        justify="center"
        alignItems="center">
        <Grid item>
          <Typography id="Our-prints-text" variant="h4">Our Print</Typography>
          <Typography id="subtitle" variant="subtitle1">Welcome page</Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" id="login-btn" onClick={e => {
          }}>
            Login
          </Button>
        </Grid>
      </Grid>

      <style jsx>{`
        #grid-container {
          background: #c62828;
          height: 100vh;
        }
        a#login-link {
          color: white;
          font-size: 20px;
        }
        #stumagz-text {
          color: white;
          font-weight: bold;
        }
        #subtitle {
          padding-bottom: 1rem;
          color: white;
        }
      `}</style>
    </div>
  )
}
