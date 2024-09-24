import ElDatetimePicker from '../index';

export default {
  id: 'el-datetime-picker-blocks',
  title: '组件列表/DATETIME PICKER 日期时间选择器/内置区块',
  component: ElDatetimePicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    () => ({
      provide() {
        return {
          VUE_APP_DESIGNER: true,
        };
      },
      template: '<div style="width: 500px;"><story/></div>',
    }),
  ],
};

export const Default = {
  name: '基础示例',
  render: () => ({
    template: '<el-datetime-picker></el-datetime-picker>',
  }),
};