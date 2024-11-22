export default {
  data() {
    return {
      cssRuleClassName: '',
    };
  },

  created() {
    let list = this.$vnode?.data?.class || [];
    list = [...list, ...(this.$vnode?.data?.staticClass?.split(' ') || [])];

    this.cssRuleClassName = list?.find((className) => /^css-rule-?/.test(className)) || '';
  },
};
