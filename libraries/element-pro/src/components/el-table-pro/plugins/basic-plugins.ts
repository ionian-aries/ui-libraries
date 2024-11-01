/* eslint-disable no-shadow */
/* 组件功能扩展插件 */
// export {};
import _, { isFunction, isNil } from 'lodash';
import {
  computed, ref, watch, onMounted,
} from '@vue/composition-api';
import { SelectOptions } from '@element-pro';
import { listToTree } from '@lcap/vue2-utils/utils';
import { $ref, $render, createUseUpdateSync } from '@lcap/vue2-utils';

import type {
  NaslComponentPluginOptions,
  Slot,
} from '@lcap/vue2-utils/plugins/types';

export { useDataSource } from '@lcap/vue2-utils';
export const useUpdateSync = createUseUpdateSync([
  { name: 'selectedRowKeys', event: 'update:selectedRowKeys' },
]);

export const useTable: NaslComponentPluginOptions = {
  props: [
    'onPageChange',
    'page',
    'pageSize',
    'pageSizeOptions',
    'showTotal',
    'showJumper',
    'virtual',
  ],
  setup(props, ctx) {
    const current = props.useRef('page', (v) => v ?? 1);
    const pageSize = props.useRef('pageSize', (v) => v ?? 10);
    const sorting = props.useComputed('sorting', (value) => value);

    const data = props.useComputed('data', (v) => {
      const treeDisplay = props.get('treeDisplay');
      const parentField = props.get<string>('parentField') || 'parent';
      const childrenField = props.get('childrenField') || 'children';
      if (!treeDisplay) return v;
      return listToTree(v, {
        parentField,
        childrenField: 'chiildren',
      });
    });
    const autoMergeFields = ref([]);
    watch(
      () => [autoMergeFields.value, data.value],
      (value, oldValue) => {
        if (_.isEqual(value, oldValue)) return;
        const [autoMergeFields, data] = value;
        if (_.isEmpty(autoMergeFields) || _.isEmpty(data)) return;
        data.forEach((item, index) => {
          _.forEach(autoMergeFields, (field) => {
            let rowspan = 1;
            for (let i = index + 1; i < data.length; i++) {
              if (data[i][field.colKey] === item[field.colKey]) {
                rowspan++;
              } else {
                break;
              }
            }
            if (rowspan > 1) {
              item.rowspan = _.isObject(item.rowspan)
                ? Object.assign(item.rowspan, {
                  [field.colKey]: rowspan,
                })
                : {
                  [field.colKey]: rowspan,
                };
            }
          });
        });
        // data.value.forEach((item, index) => {
        // });
        // autoMergeFields.forEach((item) => {}
        // const { autoMerge, data } = value;
        // data.value.forEach((item, index) => {});
      },
    );

    const renderSlot = (vnodes) => {
      return vnodes.flatMap((vnode) => {
        if (!vnode.tag?.includes('ElTableColumnPro')) return [];
        const attrs = _.get(vnode, 'data.attrs', {});

        const nodePath = _.get(attrs, 'data-nodepath');
        const { cell, title } = _.get(vnode, 'data.scopedSlots', {});

        const titleProps = _.isFunction(title)
          ? {
            title: (h, { row, rowIndex, col }) => title({ row, index: rowIndex, col }),
          }
          : {};

        const cellRender = ({ type, cell }) => _.cond([
          [
            _.matches({ type: 'number' }),
            () => ({
              cell: (h, { row, rowIndex }) => pageSize.value * (current.value - 1) + rowIndex + 1,
            }),
          ],
          [_.matches({ type: _.isString }), () => ({})],
          [
            _.matches({ cell: _.isFunction }),
            () => ({
              cell: (h, { row, rowIndex, col }) => cell({ item: row, index: rowIndex, col }),
            }),
          ],
        ])({ type, cell });
        const cellProps = cellRender({ type: attrs.type, cell });
        return [
          {
            ...attrs,
            ...cellProps,
            ...titleProps,
            attrs: {
              'data-nodepath': nodePath,
            },
          },
        ];
      });
    };
    const scroll = props.useComputed('virtual', (value) => (value ? { scroll: { type: 'virtual' } } : {}));

    const onLoadData = props.get('onLoadData');

    const onPageChange = props.useComputed('onPageChange', (value) => {
      return (pageInfo) => {
        pageSize.value = pageInfo.pageSize;
        current.value = pageInfo.current;
        _.attempt(onLoadData, {
          page: pageInfo.current,
          size: pageInfo.pageSize,
        });
        _.attempt(value, pageInfo);
      };
    });

    const pageSizeOptions = props.useComputed('pageSizeOptions', (value) => {
      try {
        const list = JSON.parse(value);
        return Array.isArray(list) ? list : [10, 20, 50];
      } catch (e) {
        return [10, 20, 50];
      }
    });

    const totalContent = props.useComputed(
      'showTotal',
      (value: boolean) => value ?? true,
    );
    const showJumper = props.useComputed(
      'showJumper',
      (value: boolean) => value ?? true,
    );

    const total = props.useComputed('total', (value) => value ?? 10);

    const paginationProps = props.useComputed('pagination');
    const pagination = computed(() => {
      if (paginationProps.value === false) {
        return false;
      }
      return {
        pageSizeOptions: pageSizeOptions.value,
        showJumper: showJumper.value,
        current: current.value,
        total: total.value,
        pageSize: pageSize.value,
        totalContent: totalContent.value,
      };
    });

    // 产品要求默认开边框
    const bordered = props.useComputed('bordered', (v) => (isNil(v) ? true : v));

    const onSortChange = props.useComputed('onSortChange', (value) => {
      return (...arg) => {
        _.attempt(onLoadData, {
          page: current.value,
          size: pageSize.value,
          sort: _.get(arg, '0.sortBy'),
          order: _.get(arg, '0.descending') ? 'desc' : 'asc',
        });
        _.attempt(value, ...arg);
      };
    });

    onMounted(() => {
      if (_.isFunction(onLoadData)) {
        onLoadData?.({
          page: current.value,
          size: pageSize.value,
          sort: sorting.value?.field,
          order: sorting.value?.order,
        });
      }
    });

    return {
      onPageChange,
      ...scroll.value,
      pagination,
      onSortChange,
      bordered,
      onSelectChange: (
        selectedRowKeys: Array<string | number>,
        context: SelectOptions<any>,
      ) => {
        const onSelectChange = props.get('onSelectChange');

        if (isFunction(onSelectChange)) {
          onSelectChange({
            selectedRowKeys,
            ...context,
          });
        }
      },
      [$ref]: {
        reload() {
          current.value = 1;
          if (_.isFunction(onLoadData)) {
            onLoadData?.({
              page: current.value,
              size: pageSize.value,
              sort: sorting.value?.field,
              order: sorting.value?.order,
            });
          }
        },
      },
      [$render](resultVNode) {
        const vnodes = ctx.setupContext.slots.default();
        const columns = renderSlot(vnodes);
        autoMergeFields.value = columns?.filter?.((item) => item.autoMerge) ?? [];
        resultVNode.componentOptions.propsData.columns = columns;
        return resultVNode;
      },
    };
  },
};
