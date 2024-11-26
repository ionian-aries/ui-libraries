import cls from 'classnames';

export default {
  data() {
    return {
      cssRuleClassName: '',
    };
  },

  mounted() {
    const clx = cls(this.$vnode?.data?.class || [], this.$vnode?.data?.staticClass || '');

    this.cssRuleClassName = clx.split(' ')?.find((className) => /^cw-css-rule-?/.test(className)) || '';
  },
};
