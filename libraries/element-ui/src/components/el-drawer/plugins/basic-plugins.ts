/* 组件功能扩展插件 */
import type { NaslComponentPluginOptions } from '@lcap/vue2-utils/plugins';
import { $ref } from '@lcap/vue2-utils/plugins/index';
import _ from 'lodash';
import { isNullOrUndefined } from '@lcap/vue2-utils/plugins/utils';
import { $render, useUpdateSync } from '@lcap/vue2-utils';

export const useDialog: NaslComponentPluginOptions = {
  setup: (props) => {
    // 同时响应外部  visible属性设置的变化
    // const opened = props.useRef('visible', (v) => !!v);
    const { visible: opened, ...reset } = useUpdateSync(props, [
      { name: 'visible', event: 'update:visible' },
    ]);
    // const map = useUpdateSync(props, [
    //   { name: 'visible', event: 'update:visible' },
    // ]);
    // const opened=props.useComputed
    // console.log(map, '===');

    return {
      visible: opened,
      [$ref]: {
        // 外部可以读取 visible
        props: ['visible'],
        // ide 内使用
        designerControl() {
          opened.value = !opened;
        },
        open: () => {
          opened.value = true;
        },
        close: () => {
          opened.value = false;
        },
      },
    };
  },
  order: 1,
};

export const useEvents = {
  setup: (props) => {
    return {
      beforeClose: (done) => {
        const onBeforeClose = props.get('onBeforeClose');
        if (_.isFunction(onBeforeClose)) {
          _.attempt(onBeforeClose, done);
        }
        done();
      },
    };
  },
  order: 2,
};
