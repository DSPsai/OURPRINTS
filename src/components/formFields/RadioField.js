import React from 'react';
import { useField } from 'formik';
import Box from '@material-ui/core/Box';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

function RadioField({ label, ...props }) {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Box pt={1}>
        <RadioGroup {...field}>
          {
            props.options.map((item, index) => (
              <FormControlLabel index={index} labelPlacement="left" value={item.value}
                control={<Radio />} label={item.label} />
            ))
          }
        </RadioGroup>
      </Box>
    </FormControl>
  );
}

export default RadioField;
