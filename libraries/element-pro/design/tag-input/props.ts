/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { ElTagInputProps } from './type';
import { PropType } from 'vue';

export default {
  /** 宽度随内容自适应 */
  autoWidth: Boolean,
  /** 无边框模式 */
  borderless: Boolean,
  /** 是否可清空 */
  clearable: Boolean,
  /** 标签过多的情况下，折叠项内容，默认为 `+N`。如果需要悬浮就显示其他内容，可以使用 collapsedItems 自定义。`value` 表示当前存在的所有标签，`collapsedSelectedItems` 表示折叠的标签，`count` 表示折叠的数量，`onClose` 表示移除标签的事件回调 */
  collapsedItems: {
    type: Function as PropType<ElTagInputProps['collapsedItems']>,
  },
  /** 是否禁用标签输入框 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 拖拽调整标签顺序 */
  dragSort: Boolean,
  /** 标签超出时的呈现方式，有两种：横向滚动显示 和 换行显示 */
  excessTagsDisplayType: {
    type: String as PropType<ElTagInputProps['excessTagsDisplayType']>,
    default: 'break-line' as ElTagInputProps['excessTagsDisplayType'],
    validator(val: ElTagInputProps['excessTagsDisplayType']): boolean {
      if (!val) return true;
      return ['scroll', 'break-line'].includes(val);
    },
  },
  /** 透传 Input 输入框组件全部属性 */
  inputProps: {
    type: Object as PropType<ElTagInputProps['inputProps']>,
  },
  /** 输入框的值 */
  inputValue: {
    type: [String, Number] as PropType<ElTagInputProps['inputValue']>,
    default: undefined,
  },
  /** 输入框的值，非受控属性 */
  defaultInputValue: {
    type: [String, Number] as PropType<ElTagInputProps['defaultInputValue']>,
    default: '',
  },
  /** 左侧文本 */
  label: {
    type: [String, Function] as PropType<ElTagInputProps['label']>,
  },
  /** 最大允许输入的标签数量 */
  max: {
    type: Number,
  },
  /** 最小折叠数量，用于标签数量过多的情况下折叠选中项，超出该数值的选中项折叠。值为 0 则表示不折叠 */
  minCollapsedNum: {
    type: Number,
    default: 0,
  },
  /** 占位符 */
  placeholder: {
    type: String,
    default: undefined,
  },
  /** 组件前置图标 */
  prefixIcon: {
    type: Function as PropType<ElTagInputProps['prefixIcon']>,
  },
  /** 只读状态，值为真会隐藏标签移除按钮和输入框 */
  readonly: Boolean,
  /** 组件尺寸 */
  size: {
    type: String as PropType<ElTagInputProps['size']>,
    default: 'medium' as ElTagInputProps['size'],
    validator(val: ElTagInputProps['size']): boolean {
      if (!val) return true;
      return ['small', 'medium', 'large'].includes(val);
    },
  },
  /** 输入框状态 */
  status: {
    type: String as PropType<ElTagInputProps['status']>,
    validator(val: ElTagInputProps['status']): boolean {
      if (!val) return true;
      return ['default', 'success', 'warning', 'error'].includes(val);
    },
  },
  /** 后置图标前的后置内容 */
  suffix: {
    type: [String, Function] as PropType<ElTagInputProps['suffix']>,
  },
  /** 组件后置图标 */
  suffixIcon: {
    type: Function as PropType<ElTagInputProps['suffixIcon']>,
  },
  /** 自定义标签的内部内容，每一个标签的当前值。注意和 `valueDisplay` 区分，`valueDisplay`  是用来定义全部标签内容，而非某一个标签 */
  tag: {
    type: [String, Function] as PropType<ElTagInputProps['tag']>,
  },
  /** 透传 Tag 组件全部属性 */
  tagProps: {
    type: Object as PropType<ElTagInputProps['tagProps']>,
  },
  /** 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式 */
  tips: {
    type: [String, Function] as PropType<ElTagInputProps['tips']>,
  },
  /** 值 */
  value: {
    type: Array as PropType<ElTagInputProps['value']>,
    default: undefined,
  },
  /** 值，非受控属性 */
  defaultValue: {
    type: Array as PropType<ElTagInputProps['defaultValue']>,
    default: (): ElTagInputProps['defaultValue'] => [],
  },
  /** 自定义值呈现的全部内容，参数为所有标签的值 */
  valueDisplay: {
    type: [String, Function] as PropType<ElTagInputProps['valueDisplay']>,
  },
  /** 失去焦点时触发 */
  onBlur: Function as PropType<ElTagInputProps['onBlur']>,
  /** 值变化时触发，参数 `context.trigger` 表示数据变化的触发来源；`context.index` 指当前变化项的下标；`context.item` 指当前变化项；`context.e` 表示事件参数 */
  onChange: Function as PropType<ElTagInputProps['onChange']>,
  /** 清空按钮点击时触发 */
  onClear: Function as PropType<ElTagInputProps['onClear']>,
  /** 点击组件时触发 */
  onClick: Function as PropType<ElTagInputProps['onClick']>,
  /** 【开发中】拖拽排序时触发 */
  onDragSort: Function as PropType<ElTagInputProps['onDragSort']>,
  /** 按键按下 Enter 时触发 */
  onEnter: Function as PropType<ElTagInputProps['onEnter']>,
  /** 聚焦时触发 */
  onFocus: Function as PropType<ElTagInputProps['onFocus']>,
  /** 输入框值发生变化时触发，`context.trigger` 表示触发输入框值变化的来源：文本输入触发、清除按钮触发、回车键触发等 */
  onInputChange: Function as PropType<ElTagInputProps['onInputChange']>,
  /** 进入输入框时触发 */
  onMouseenter: Function as PropType<ElTagInputProps['onMouseenter']>,
  /** 离开输入框时触发 */
  onMouseleave: Function as PropType<ElTagInputProps['onMouseleave']>,
  /** 粘贴事件，`pasteValue` 表示粘贴板的内容 */
  onPaste: Function as PropType<ElTagInputProps['onPaste']>,
  /** 移除单个标签时触发 */
  onRemove: Function as PropType<ElTagInputProps['onRemove']>,
};