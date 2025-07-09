<template>
  <tr ref="footer" :class="$style.row" ref="row">
    <td :class="$style.cell" v-for="(item, index) in currentList" :key="index">
      {{ item }}
    </td>
  </tr>
</template>

<script>
import { Decimal } from 'decimal.js';

export default {
  name: 'u-table-render-footer',
  props: {
    footerCalcText: { type: String, default: '合计' },
    footerCalcOption: { type: String, default: 'sum' },
    visibleColumnVMs: {
      type: Array,
      default: () => [],
    },
    currentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    data() {
      return this.visibleColumnVMs.map((vm) =>
        vm.field && !['radio', 'checkbox'].includes(vm.type)
          ? this.currentData.map((item) => vm.currentFormatter.format(this.$at(item, vm.field) ?? item))
          : [],
      );
    },
    currentList() {
      return this.getCurrentList();
    },
  },
  methods: {
    // 转换为Decimal数组
    convertToDecimals(item) {
      return item
        .map((v) => {
          try {
            return new Decimal(v);
          } catch {
            return null;
          }
        })
        .filter((v) => v !== null);
    },

    // 计算精度
    calculatePrecision(values) {
      const precisions = values.map((v) => (v.toString().split('.')[1] || '').length);
      return Math.min(Math.max(...precisions), 20);
    },

    getCurrentList() {
      if (!this.data?.length) return [];
      return this.data.map((item, index) => {
        if (index === 0) return this.footerCalcText;

        const values = this.convertToDecimals(item);
        if (!values.length) return '';

        const precision = this.calculatePrecision(values);
        const getSum = (values) => values.reduce((a, b) => a.plus(b), new Decimal(0));

        const calcFunctions = {
          sum: (values) => getSum(values).toFixed(precision),
          max: (values) => values.reduce((a, b) => Decimal.max(a, b)).toString(),
          min: (values) => values.reduce((a, b) => Decimal.min(a, b)).toString(),
          average: (values) => getSum(values).dividedBy(values.length).toFixed(precision),
        };

        return calcFunctions[this.footerCalcOption](values);
      });
    },
  },
};
</script>

<style module src="./index.css"></style>
