import './index.css';

export default {
  name: 'ElAbsoluteLayout',
  render(h) {
    return h('div', {
      class: 'el-absolute-layout',
      on: this.$listeners,
    }, this.$scopedSlots.default ? this.$scopedSlots.default() : null);
  },
};
