import { Slider } from '@element-pro';
import { registerComponent } from '@lcap/vue2-utils';
import * as plugins from './plugins';
import { WithFormItem } from '../el-form-pro';
import { TAG_NAME, FORM_TAG_NAME } from './constants';
import './index.less';

export const ElSliderPro = registerComponent(Slider, plugins, {
  name: TAG_NAME,
  nativeEvents: [],
  slotNames: [],
  methodNames: [],
  model: {
    prop: 'value',
    event: 'update:value',
  },
});

export const ElFormSliderPro = WithFormItem(ElSliderPro, { name: FORM_TAG_NAME, methodNames: [] });
export default ElSliderPro;
