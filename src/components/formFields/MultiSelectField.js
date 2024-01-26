import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

function MultiSelect(props) {
  const {
    required,
    label,
    form: { touched, errors },
    field: { name, value },
    options,
    fullWidth,
    margin,
    onChange
  } = props;
  const id = `sel_${name}`;
  const errorText = errors[name];
  const hasError = touched[name] && errors[name];
  return (
    <FormControl fullWidth={fullWidth} margin={margin} required={required || false} error={hasError}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        multiple
        renderValue={selected => selected && selected.join(', ')}
        onChange={onChange}
        value={value.split(',')}
        inputProps={{
          name: name,
          id: `multi_input_${id}`
        }}
      >
        {options.map(item => (
          <MenuItem key={`${id}_${item.value}`} value={item.value}>
            <Checkbox checked={value.includes(item.value)} />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}

MultiSelect.defaultProps = {
  required: false,
  fullWidth: true,
  margin: 'normal'
};

export default MultiSelect;
