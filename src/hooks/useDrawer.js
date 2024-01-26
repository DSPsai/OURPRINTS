import { useState } from 'react';

export default function useDrawer() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  return {
    open, setOpen,
    data,setData
  }
}