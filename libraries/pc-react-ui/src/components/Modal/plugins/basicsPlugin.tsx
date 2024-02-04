import React from 'react';
import { useControllableValue } from 'ahooks';
import _ from 'lodash';

export function useHandleOpenRef(props) {
  const openProps = props.get('open');
  const ref = props.get('ref');
  const modalRef = React.useRef();
  const [open, setOpen] = useControllableValue(_.filterUnderfinedValue({ value: openProps }));
  React.useImperativeHandle(ref, () => ({
    setOpen,
    open,
  }), [modalRef]);
  return {
    open,
    ref: modalRef,
  };
}
