import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

function SingleSelect(props) {
  const {
    required,
    label,
    form: { touched, errors },
    field: { name, onChange, value },
    options,
    fullWidth,
    margin,
    ...other
  } = props;
  const id = `sel_${name}`;
  const errorText = errors[name];
  const hasError = touched[name] && errors[name];
  return (
    <FormControl fullWidth={fullWidth} margin={margin} required={required || false} error={hasError}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        onChange={onChange}
        value={value || ''}
        required={required}
        inputProps={{
          name: name,
          id: `input_${id}`
        }}
        {...other}
      >
        {options.map(item => (
          <MenuItem key={`${id}_${item.value}`} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}

SingleSelect.defaultProps = {
  required: false,
  fullWidth: true,
  margin: 'normal'
};

export default SingleSelect;
