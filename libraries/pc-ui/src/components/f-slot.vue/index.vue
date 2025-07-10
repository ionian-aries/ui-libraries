<script>
import MEmitter from '../m-emitter.vue';
export default {
    name: 'f-slot',
    mixins: [MEmitter],
    props: {
        vm: null,
        name: String,
        props: Object,
        catchError: { type: Boolean, default: true },
    },
    render(h) {
        let { vm, name, props, catchError } = this;

        vm = vm || this.$parent;
        const scopedSlot = vm.$scopedSlots[name];
        const slot = vm.$slots[name];
        if (scopedSlot) {
            try {
                const slotResult = scopedSlot(props);
                if (slotResult) {
                    const newScopeValue = [];
                    (slotResult || []).forEach((scopeValue) => {
                        if (scopeValue.tag !== vm.$vnode.tag) {
                            newScopeValue.push(scopeValue);
                            if (props?.inTableView) {
                                const propsData = scopeValue.componentOptions.propsData || {};
                                this.$contact('u-table-view', (parentVM) => {
                                    if (!Array.isArray(parentVM.calcData[props?.columnIndex])) {
                                        parentVM.calcData[props?.columnIndex] = [];
                                    }
                                    parentVM.calcData[props?.columnIndex].push(propsData.value || propsData.text);
                                });
                            }
                        }
                    });
                    return newScopeValue;
                } else
                    return this.$slots.default;
            } catch (e) {
                if (catchError)
                    return h('div', e.message || e);
                else
                    throw e;
            }
        } else if (slot)
            return slot;
        else
            return this.$slots.default;
    },
    destroyed() {
        // 参考column.vue的实现，在组件销毁时重置calcData
        if (this.props?.inTableView && this.props?.columnIndex !== undefined) {
            this.$contact('u-table-view', (parentVM) => {
                if (parentVM.calcData && parentVM.calcData[this.props.columnIndex]) {
                    parentVM.calcData[this.props.columnIndex] = [];
                }
            });
        }
    },
};
</script>
