import React from 'react';
import moment from 'moment';

const FormattedDateTime = ({ date }) => {
  return (
    <>
      {date
        ? moment(moment.utc(date).toDate())
            .local()
            .format('DD-MM-YYYY HH:mm:ss')
        : ''}
    </>
  );
};

export default FormattedDateTime;
