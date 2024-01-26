import _ from 'lodash';

export default function handle400Error(err, setErrors) {
  let errorsArray = _.get(err, 'response.data.errors', []);
  if (!errorsArray.length) {
    errorsArray.forEach(errorResponse => {
      errors[errorResponse.context.key] = errorResponse.message;
    });    return;
  }
  let errors = {};
  errorsArray.forEach(errorResponse => {
    errors[errorResponse.context.key] = errorResponse.message;
  });

  console.log(errors);

  setErrors(errors);
}