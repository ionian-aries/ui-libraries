import { DatePicker } from '@element-pro';
import { registerComponent } from '@lcap/vue2-utils';
import * as plugins from './plugins';

export const ElDateTimePickerPro = registerComponent(DatePicker, plugins, {
  nativeEvents: [],
  slotNames: [],
  methodNames: [],
});

export default ElDateTimePickerPro;
