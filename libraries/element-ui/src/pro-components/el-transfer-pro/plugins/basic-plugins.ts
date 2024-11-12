/* 组件功能扩展插件 */
import type { NaslComponentPluginOptions } from '@lcap/vue2-utils/plugins';
import { at, isFunction, isObject } from 'lodash';
import { createUseUpdateSync } from '@lcap/vue2-utils';
import { Slot } from '@lcap/vue2-utils/plugins/types.js';
import { unref } from '@vue/composition-api';

export const useUpdateSync = createUseUpdateSync([{ name: 'value', event: 'change' }]);

export { useDataSource, useInitialLoaded } from '@lcap/vue2-utils/plugins/index';

export const useDataSourceRender: NaslComponentPluginOptions = {
  props: ['data', 'valueField', 'textField', 'disabledField'],
  setup({ useComputed }) {
    const keys = useComputed(['valueField', 'textField', 'disabledField', 'keys'], (valueField, textField, disabledField, keysVal = {}) => {
      return {
        label: textField || 'label',
        value: valueField || 'value',
        disabled: disabledField || 'disabled',
        ...(isObject(keysVal) ? keysVal : {}),
      };
    });
    const dataRef = useComputed(['data', 'valueField', 'textField', 'disabledField'], (data) => {
      const keyMap = unref(keys);
      const optionList = data.map((item) => {
        if (isObject(item)) {
          return item;
        }

        return {
          [keyMap.value]: item,
          [keyMap.label]: item,
          [keyMap.disabled]: false,
        };
      });
      return optionList;
    });

    return {
      data: dataRef,
      keys,
    };
  },
};

export const useCustomSlotRender: NaslComponentPluginOptions = {
  props: ['optionIsSlot'],
  setup({ get: propGet, useComputed }) {
    const slotFooter = useComputed(['slotFootersource', 'slotFootertarget'], (slotFootersource, slotFootertarget) => {
      const hasFooterSource = typeof slotFootersource === 'function';
      const hasFooterTarget = typeof slotFootertarget === 'function';
      if (!hasFooterSource && !hasFooterSource) {
        return null;
      }
      return (footerProps) => {
        if (footerProps.type === 'source' && hasFooterSource) {
          return slotFootersource();
        }
        if (footerProps.type === 'target' && hasFooterTarget) {
          return slotFootertarget();
        }
        return null;
      };
    });

    return {
      slotTitle: (titleProps) => {
        const slotTitlesource = propGet('slotTitlesource');
        const slotTitletarget = propGet('slotTitletarget');
        const titleSourceVnode = typeof slotTitlesource === 'function' ? slotTitlesource() : null;
        const titleTargetVnode = typeof slotTitletarget === 'function' ? slotTitletarget() : null;
        if (titleProps.type === 'source') {
          return titleSourceVnode;
        }
        if (titleProps.type === 'target') {
          return titleTargetVnode;
        }
        return null;
      },
      slotFooter,
      transferItem: (h, { data, index, type }) => {
        const [slotTransferItem, slotOption, optionIsSlot] = propGet<[Slot, Slot, boolean]>(['slotTransferItem', 'slotOption', 'optionIsSlot']);
        if (isFunction(slotTransferItem)) {
          return slotTransferItem({ data, index, type });
        }

        if (optionIsSlot && isFunction(slotOption)) {
          return slotOption({
            item: data,
            index,
            type,
          });
        }

        return null;
      },
    };
  },
};
