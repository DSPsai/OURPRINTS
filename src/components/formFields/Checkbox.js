import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { useField } from 'formik';

function MyCheckbox({ label, ...props }) {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormGroup row>
      <FormControlLabel
        control={<Checkbox checked={field.value} {...field} />}
        label={label}
      />
    </FormGroup>
  );
}

export default MyCheckbox;
