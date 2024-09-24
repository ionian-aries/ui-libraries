import ElSwitchPro from '../index';

export default {
  id: 'el-switch-pro-blocks',
  title: '组件列表/Switch 开关/内置区块',
  component: ElSwitchPro,
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
      template: '<div ><story/></div>',
    }),
  ],
};

export const Default = {
  name: '基础示例',
  render: () => ({
    template: '<el-switch-pro></el-switch-pro>',
  }),
};