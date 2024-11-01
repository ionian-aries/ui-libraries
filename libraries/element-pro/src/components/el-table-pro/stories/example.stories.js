import ElTablePro from '../index';

export default {
  id: 'el-table-pro-examples',
  title: '组件列表/Table 表格/示例',
  component: ElTablePro,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
};

export const Default = {
  name: '基础示例',
  render: () => ({
    // moud
    async mounted() {
      // setTimeout(() => {
      // this.type = 'multiple';
      // this.selectedRowKeys.push(1);
      // console.log('=====watch');
      // this.rowspan = 3;
      console.log('object');
      // }, 3000);
      this.list = await this.data();
    },
    watch: {
      selectedRowKeys(value) {
        console.log(value, '===watch');
      },
    },
    data() {
      return {
        data: async (params) => {
          const initialData = [];
          const total = 200;
          for (let i = 0; i < total; i++) {
            initialData.push({
              index: i,
              applicant: ['贾明', '张三', '王芳'][i % 3],
              status: i % 3,
              channel: ['电子签署', '电子签署', '纸质签署'][i % 3],
              detail: {
                email: [
                  'w.cezkdudy@lhll.au',
                  'r.nmgw@peurezgn.sl',
                  'p.cumx@rampblpa.ru',
                ][i % 3],
              },
              matters: [
                '宣传物料制作费用',
                'algolia 服务报销',
                '相关周边制作费',
                '激励奖品快递费',
              ][i % 4],
              time: [2, 10, 1][i % 3],
              createTime: [
                '2022-01-01',
                '2022-02-01',
                '2022-02-01',
                '2022-03-01',
                '2022-04-01',
              ][i % 4],
            });
          }

          return {
            list: initialData,
            total,
          };
        },
        list: [],
        rowspan: 2,
        type: undefined,
        selectedRowKeys: [],
        columns: [
          { colKey: 'applicant', title: '申请人', width: 100 },
          { colKey: 'status', title: '状态', width: 100 },
          { colKey: 'channel', title: '渠道', width: 100 },
          { colKey: 'detail.email', title: '邮箱', width: 100 },
          { colKey: 'matters', title: '事项', width: 100 },
          { colKey: 'time', title: '时长', width: 100 },
          { colKey: 'createTime', title: '创建时间', width: 100 },
        ],
      };
    },
    methods: {
      log(value) {
        console.log(value);
      },
      onSortChange(...arg) {
        console.log(arg, 'arg===');
      },
      onDragSortChange(...arg) {
        console.log(arg, 'arg===');
      },
      rowspanAndColspan({
        row, col, rowIndex, colIndex,
      }) {
        // console.log(rowIndex,'rowIndex`');
        // if (colIndex == 1 && rowIndex % this.rowspan == 0) {
        //   return {
        //     rowspan: this.rowspan,
        //   };
        // }
        // return {};
        console.count('merge');
        if (row?.rowspan?.[col.colKey] > 1) {
          console.log(row, col, '===');
          return {
            rowspan: 2,
          };
        }
        // console.log('object2');
        return {};
      },
    },
    template: `<el-table-pro
    row-key="index"
   :dataSource="data"
   :selectedRowKeys.sync="selectedRowKeys"
   @sort-change="onSortChange"
   :onRowClick="log"
   dragSort="row"
   height="300"
   :onDragSort="onDragSortChange"
    >

    <el-table-column-pro title="申请人" type="multiple"       >
    <template #cell="cell">
      <div>{{selectedRowKeys}}</div>
    </template>
    </el-table-column-pro>

        <el-table-column-pro title="渠道" colKey="channel" :sorter="true" :autoMerge="true" >
    <template #cell="cell">
      <div>{{ cell.item.channel }}</div>
    </template>
    </el-table-column-pro>
   
    <el-table-column-pro title="渠道" colKey="createTime" width="300" > </el-table-column-pro>
     

    </el-table-pro>`,
  }),
};
// <el-table-column-pro data-nodepath="123"  >
//   <template #title="title">
//      <div>
//      <div>1234</div>
//      </div>
//  </template>
//   <template #cell="cell">
//       <div>
//           <div>{{ cell.row.applicant }}</div>
//      </div>
//    </template>
// </el-table-column-pro>
