import _, { isFunction } from 'lodash';

import { createUseUpdateSync } from '@lcap/vue2-utils';
import { computed } from '@vue/composition-api';
import { NaslComponentPluginOptions, Slot } from '@lcap/vue2-utils/plugins/types.js';

export { useDataSource, useInitialLoaded } from '@lcap/vue2-utils';
export { useFormFieldClass } from '../../../plugins/use-form-field-class';
export { usePopupTheme } from '../../../plugins/use-popup-theme';
export const useUpdateSync = createUseUpdateSync();

function listToTree(dataSource, parentField, valueField = 'value') {
  if (_.isNil(parentField)) return dataSource;
  const map = new Map<string, Record<string, any>>(
    dataSource.map((item) => [_.get(item, valueField), item]),
  );
  const tree = [] as any[];
  dataSource.forEach((item) => {
    if (map.get(_.get(item, parentField))) {
      const parent = map.get(_.get(item, parentField));
      if (!parent) return;
      if (!Array.isArray(parent.children)) parent.children = [];
      parent.children.push(map.get(_.get(item, valueField)));
    } else {
      tree.push(map.get(_.get(item, valueField)));
    }
  });
  return tree;
}
export const useCascaderSelect: NaslComponentPluginOptions = {
  props: ['valueField', 'labelField', 'data', 'optionIsSlot'],
  setup(props, ctx) {
    const valueField = props.useComputed('valueField', (v) => v || 'value');
    const textField = props.useComputed('textField', (v) => v || 'label');
    const parentField = props.useComputed('parentField', (v) => v);

    const childrenField = props.useComputed(
      'childrenField',
      (v) => v || 'children',
    );
    const options = props.useComputed('data', (data) => {
      if (_.isEmpty(data)) return undefined;
      if (_.isNil(parentField.value)) return data;
      return listToTree(data, parentField.value, valueField.value);
    });
    const keys = props.useComputed('keys', (v) => (_.isObject(v) ? v : {}));

    return {
      options,
      class: 'cw-form-field',
      keys: computed(() => ({
        value: valueField.value,
        label: textField.value,
        children: childrenField.value,
        ...keys.value,
      })),
      slotOptionLabel: ({ item, index }) => {
        const [optionIsSlot, slotOption] = props.get<[boolean, Slot]>(['optionIsSlot', 'slotOption']);

        if (optionIsSlot && isFunction(slotOption)) {
          return slotOption({
            item,
            index,
          });
        }

        return null;
      },
      slotOption: () => null,
    };
  },
};