import { NaslComponentPluginOptions } from '@lcap/vue2-utils';

/* 仅在 ide 环境生效的插件 */
export const useLowcodeStyle: NaslComponentPluginOptions = {
  setup(props, { setupContext: ctx }) {
    return {
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
