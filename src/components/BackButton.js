import React from 'react';
import { Button } from '@material-ui/core';
import ArrowLeft from '@material-ui/icons/ArrowBackOutlined'
import { useHistory } from 'react-router-dom';

export default function BackButton({path}) {
  const history = useHistory()
  return (
    <Button
    onClick={() => history.goBack()}
      color="primary"
      startIcon={<ArrowLeft />}
    >
      Back
    </Button>
  )
}