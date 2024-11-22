export default {
  data() {
    return {
      cssRuleClassName: '',
    };
  },

  created() {
    this.cssRuleClassName = this?.$vnode?.data?.staticClass?.split(' ')?.find((className) => /^css-rule-?/.test(className)) || '';
  },
};
