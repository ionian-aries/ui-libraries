/* eslint-disable no-param-reassign */
/* eslint-disable react-refresh/only-export-components */
// import React from 'react';
import { $deletePropsList, $dataSourceField } from '@/plugins/constants';

export function useHandleTransform(props) {
  const textField = props.get('textField', 'title');
  const valueField = props.get('valueField', 'key');
  const childrenField = props.get('childrenField', 'children');
  const fieldNames = props.get('fieldNames');
  return {
    [$dataSourceField]: 'treeData',
    fieldNames: {
      title: textField,
      key: valueField,
      children: childrenField,
      ...fieldNames,
    },
  };
}
