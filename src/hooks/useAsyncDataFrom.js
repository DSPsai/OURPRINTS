import { useState, useEffect } from 'react';

export default function useAsyncDataFrom(getData, initialData = []) {
  const [state, setState] = useState({
    isLoading: true,
    data: initialData,
    error: null
  });

  function refresh() {
    setState({
      isLoading: true,
      data: initialData,
      error: null
    });
    getData()
      .then(res => {
        console.log(res.data);
        setState({
          isLoading: false,
          data: res.data,
          error: null
        });
      })
      .catch(err => {
        console.log(err);
        setState({
          isLoading: false,
          data: initialData,
          error: err
        });
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    ...state,
    refresh
  };
}
