import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Field } from 'formik';

function Tags({ values, label, name, opts, ...props }) {
  return (
    <Field name={name}>
      {({ field: { value }, form: { setFieldValue } }) => {
        return (
          <Autocomplete
            id='combo-box-demo'
            fullWidth
            options={opts}
            defaultValue={{ label: values, value: values }}
            onChange={(e, v) => {
              console.log(v);
              setFieldValue(name, v ? v.value : '');
            }}
            getOptionLabel={option => option.label}
            renderInput={params => (
              <TextField
                {...params}
                label={label}
                variant='outlined'
                fullWidth
                margin='dense'
              />
            )}
            {...props}
          />
        );
      }}
    </Field>
  );
}
export default Tags;
