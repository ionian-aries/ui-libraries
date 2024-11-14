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
      popupProps: props.useComputed('popupProps', (popupProps = {}) => {
        return {
          ...popupProps,
          attach: () => {
            return ctx.refs.$base?.$el;
          },
        };
      }),
    };
  },
  onlyUseIDE: true,
  order: 11,
};
