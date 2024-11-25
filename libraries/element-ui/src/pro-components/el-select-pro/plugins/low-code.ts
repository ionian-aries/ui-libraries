import { NaslComponentPluginOptions } from '@lcap/vue2-utils';

/* 仅在 ide 环境生效的插件 */
export const useLowcodeStyle: NaslComponentPluginOptions = {
  props: ['multiple', 'valueIsSlot'],
  setup(props, { setupContext: ctx }) {
    const value = props.useComputed(['dataSource', 'multiple', 'valueIsSlot'], (d, multiple, valueIsSlot) => {
      if (!Array.isArray(d) || !d.length || !valueIsSlot) {
        return null;
      }

      return multiple ? [''] : '';
    });
    return {
      value,
    };
  },
  onlyUseIDE: true,
  order: 11,
};
