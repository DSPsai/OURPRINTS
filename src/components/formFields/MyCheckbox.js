import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

const MyCheckbox = ({ field, /*{ name, value, onChange, onBlur }*/ ...props }) => {
  return (
    <Checkbox
      inputProps={{
        'aria-label': 'primary checkbox'
      }}
      {...field}
      {...props}
    />
  );
};

export default MyCheckbox;
