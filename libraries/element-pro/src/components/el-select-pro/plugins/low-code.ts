import { NaslComponentPluginOptions } from '@lcap/vue2-utils';

/* 仅在 ide 环境生效的插件 */
export const useLowcodeStyle: NaslComponentPluginOptions = {
  setup(props) {
    const value = props.useComputed(['dataSource', 'multiple'], (d, multiple) => {
      if (!Array.isArray(d) || !d.length) {
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
