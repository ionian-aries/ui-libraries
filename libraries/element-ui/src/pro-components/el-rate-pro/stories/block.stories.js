import ElRatePro from '../index';

export default {
  id: 'el-rate-pro-blocks',
  title: 'Pro组件列表/Rate 评分/内置区块',
  component: ElRatePro,
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
    template: '<el-rate-pro></el-rate-pro>',
  }),
};
