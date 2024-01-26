import React from 'react';
import { Field } from 'formik';
import FilePicker from 'components/FilePicker';

export default function MyFilePicker({ ...props }) {
  return (
    <Field name={props.name} type="file">
      {({ field: { value }, form: { setFieldValue } }) => {
        return (
          <FilePicker
            value={value || null}
            {...props}
            onChange={file => {
              setFieldValue(props.name, file);
            }}
          />
        )
      }}
    </Field>
  );
}
