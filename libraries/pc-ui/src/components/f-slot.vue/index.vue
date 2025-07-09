<script>
import MEmitter from '../m-emitter.vue';
export default {
    name: 'f-slot',
    functional: true,
    mixins: [MEmitter],
    props: {
        vm: null,
        name: String,
        props: Object,
        catchError: { type: Boolean, default: true },
        inTableView: { type: Boolean, default: false },
    },
    render(h, context) {
        let { vm, name, props, catchError } = context.props;

        vm = vm || vm.context.parent; // @TODO: 可能不太对，需要验证一下
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
                            
                            if (props?.props?.inTableView) {
                            
                                // 获取内部组件渲染的值=scopeValue.componentOptions.propsData的value或text获取，通过this.$contact('u-table-view', (parentVM) => {传递
                                const propsData = scopeValue.componentOptions.propsData || {};
                                const value = propsData.value || propsData.text;
                                debugger
                                this.$contact('u-table-view', (parentVM) => {
                                    parentVM.calcData[props?.props?.columnIndex].push(value)
                                });
                                
                            }

                            
                        }
                    });
                    return newScopeValue;
                } else
                    return context.children;
            } catch (e) {
                if (catchError)
                    return h('div', e.message || e);
                else
                    throw e;
            }
        } else if (slot)
            return slot;
        else
            return context.children;
    },
};
</script>
