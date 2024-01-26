import React from 'react';
import { Button } from '@material-ui/core';

function ChooseFile(props) {
  return (
    <>
      <input
        id={props.name}
        name='file'
        onChange={e => {
          props.file(e.target.files[0]);
          let reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onloadend = () => {
            props.path(reader.result);
          };
        }}
        style={{ display: 'none' }}
        type='file'
      />
      <label htmlFor={props.name}>
        <Button
          size='small'
          variant='contained'
          component='span'
          color='secondary'>
          Choose A File
        </Button>
      </label>
    </>
  );
}

export default ChooseFile;
