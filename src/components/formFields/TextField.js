import React from 'react';
import { useField } from 'formik';
import TextField from '@material-ui/core/TextField';

function MyTextField({ label, ...props }) {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      label={label}
      {...field}
      {...props}
      onChange={e => {
        field.onChange(e);
        if (props.onChange) {
          props.onChange(e);
        }
      }}
      helperText={errorText || props.helperText}
      error={errorText ? true : false}
    />
  );
}

export default MyTextField;
