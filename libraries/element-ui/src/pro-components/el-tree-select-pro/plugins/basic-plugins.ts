import _, { isFunction, get as lodashGet } from 'lodash';

import { createUseUpdateSync } from '@lcap/vue2-utils';
import { computed } from '@vue/composition-api';
import { NaslComponentPluginOptions, Slot } from '@lcap/vue2-utils/plugins/types';

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

export const useTreeSelect: NaslComponentPluginOptions = {
  props: ['valueField', 'labelField', 'data', 'optionIsSlot'],
  setup(props, ctx) {
    const valueField = props.useComputed('valueField', (v) => v || 'value');
    const textField = props.useComputed('textField', (v) => v || 'label');
    const parentField = props.useComputed('parentField', (v) => v);

    const childrenField = props.useComputed(
      'childrenField',
      (v) => v || 'children',
    );
    const data = props.useComputed('data', (dataSource) => {
      if (_.isEmpty(dataSource)) return undefined;
      if (_.isNil(parentField.value)) return dataSource;
      return listToTree(dataSource, parentField.value, valueField.value);
    });
    const keys = props.useComputed('keys', (v) => (_.isObject(v) ? v : {}));

    const renderLabel = (h, node) => {
      const [optionIsSlot, slotOption] = props.get<[boolean, Slot]>(['optionIsSlot', 'slotOption']);

      if (!optionIsSlot || !isFunction(slotOption)) {
        return [
          h('span', {}, [lodashGet(node.data, textField.value)]),
        ];
      }

      return slotOption({
        item: node.data,
      });
    };

    const treeProps = computed(() => {
      return {
        label: renderLabel,
      };
    });

    return {
      data,
      keys: computed(() => ({
        value: valueField.value,
        label: textField.value,
        children: childrenField.value,
        ...keys.value,
      })),
      treeProps,
    };
  },
};