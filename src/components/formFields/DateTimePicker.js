import React from 'react';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { Field } from 'formik';

export default function MaterialUIPickers({ label, ...props }) {

  function getErrorText(meta) {
    return meta.error && meta.touched ? meta.error : '';
  }

  return (
    <Field name={props.name} type="date">
      {({ field: { value }, form: { setFieldValue }, meta }) => {
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              clearable
              label={label}
              margin="dense"
              inputVariant="outlined"
              value={value || null}
              onChange={date => {
                setFieldValue(props.name, date);
              }}
              {...props}
              helperText={getErrorText(meta) || props.helperText}
              error={getErrorText(meta) ? true : false}
            />
          </MuiPickersUtilsProvider>
        )
      }}
    </Field>
  );
}
