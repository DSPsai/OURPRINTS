import React, { useState } from 'react';
import AlertDialog from './AlertDialog';

function withAlertDialog(Component, options) {
  let callback = null;

  return function(props) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    function showAlertDialog(text) {
      setOpen(true);
      setText(text);

      return {
        onOk: cb => {
          callback = cb;
        }
      };
    }

    function onOk() {
      if (callback) {
        setOpen(false);
        callback();
      }
    }

    return (
      <>
        <Component {...props} showAlertDialog={showAlertDialog} />
        <AlertDialog {...options} open={open} setOpen={setOpen} onOk={onOk} text={text} />
      </>
    );
  };
}

export default withAlertDialog;
