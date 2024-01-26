import React from 'react';
import { FieldArray } from 'formik';
import TextField from 'components/formFields/TextField';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'components/formFields/Checkbox';
import RadioField from 'components/formFields/RadioField';
import DatePicker from 'components/formFields/DatePicker';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import './DynamicFieldsArray.scss';

function MyTextField({ label, name, type, ...props }) {
  return (
    <TextField
      name={name}
      margin={'dense'}
      fullWidth
      variant='outlined'
      label={label}
      type={type}
      {...props}
    />
  );
}

function getDefaultValue(type) {
  switch (type) {
    case 'text':
      return '';
    case 'date':
      return new Date();
    default:
      return '';
  }
}

function getDefaultObject(fields) {
  let obj = {};
  fields.forEach(field => {
    obj[field.name] = getDefaultValue(field.type);
  });

  return obj;
}

function DynamicFormArray({
  values,
  fields,
  title,
  style,
  tableStyle,
  ...props
}) {
  return (
    <Box className={'DynamicFieldsArray'}>
      <Typography variant='subtitle2'>{title}</Typography>
      <table style={{ width: '100%' }}>
        <tbody>
          <FieldArray
            name={props.name}
            render={arrayHelpers => (
              <>
                {values[props.name].map((friend, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      {
                        <>
                          {fields.map((field, key) => (
                            <td key={key}>
                              <FormField
                                key={key}
                                arrayName={props.name}
                                arrayIndex={index}
                                field={field}
                              />
                            </td>
                          ))}
                          <td>
                            <Button
                              type='button'
                              color='secondary'
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              Delete
                            </Button>
                          </td>
                        </>
                      }
                    </tr>
                  </React.Fragment>
                ))}

                <tr>
                  <td colSpan={fields.length + 1}>
                    <Button
                      type='button'
                      onClick={() =>
                        arrayHelpers.push(getDefaultObject(fields))
                      }>
                      {props.addButtonLabel || 'Add'}
                    </Button>
                  </td>
                </tr>
              </>
            )}
          />
        </tbody>
      </table>
      <div>{props.children}</div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
    </Box>
  );
}

function FormField(props) {
  switch (props.field.type) {
    case 'text':
      return <CustomTextField {...props} />;
    case 'checkbox':
      return <CustomCheckbox {...props} />;
    case 'radio':
      return <CustomRadioField {...props} />;
    case 'number':
      return <CustomNumberField {...props} />;
    case 'dropdown':
      return <CustomDropdownField {...props} />;
    case 'date':
      return <CustomDatePicker {...props} />;
    default:
      return (
        <Box mb={1}>
          <Typography>Field not found</Typography>
          <Typography variant={'caption'}>{props.field.type}</Typography>
        </Box>
      );
  }
}

function CustomTextField({ arrayName, arrayIndex, field }) {
  return (
    <MyTextField
      label={field.label}
      name={`${arrayName}.${arrayIndex}.${field.name}`}
    />
  );
}

function CustomDatePicker({ arrayName, arrayIndex, field }) {
  return (
    <DatePicker
      label={field.label}
      fullWidth
      name={`${arrayName}.${arrayIndex}.${field.name}`}
    />
  );
}

function CustomCheckbox({ arrayName, arrayIndex, field }) {
  return (
    <Checkbox
      name={`${arrayName}.${arrayIndex}.${field.name}`}
      label={field.label}
    />
  );
}

function CustomRadioField({ arrayName, arrayIndex, field }) {
  return (
    <RadioField
      name={`${arrayName}.${arrayIndex}.${field.name}`}
      label={field.label}
    />
  );
}

function CustomNumberField({ arrayName, arrayIndex, field }) {
  return (
    <MyTextField
      name={`${arrayName}.${arrayIndex}.${field.name}`}
      type='number'
      label={field.label}
    />
  );
}

function CustomDropdownField({ arrayName, arrayIndex, field }) {
  return (
    <MyTextField
      name={`${arrayName}.${arrayIndex}.${field.name}`}
      label={field.label}
      select>
      {field.options.map((item, index) => (
        <MenuItem key={index} value={item}>
          {item}
        </MenuItem>
      ))}
    </MyTextField>
  );
}

export default DynamicFormArray;
