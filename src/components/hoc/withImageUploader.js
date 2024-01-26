import React from 'react'

function withImageUploader(Component, { name, url }) {
  return function(props) {
    return <Component {...props} />
  }
}

export default withImageUploader;