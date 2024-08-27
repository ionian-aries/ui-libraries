/// <reference types="@nasl/types" />

namespace nasl.ui {
  @IDEExtraInfo({
    show: true,
    ideusage: {
      idetype: 'element',
    },
  })
  @Component({
    title: '日期选择器',
    icon: 'date-picker',
    description: '',
    group: 'Selector',
  })
  export class ElDatePickerPro extends ViewComponent {
    @Prop({
      title: '值',
    })
    value: ElDatePickerProOptions['value'];

    @Prop({
      title: '起始值',
    })
    startDate: ElDatePickerProOptions['startDate'];

    @Prop({
      title: '结束值',
    })
    endDate: ElDatePickerProOptions['endDate'];

    constructor(options?: Partial<ElDatePickerProOptions>) {
      super();
    }
  }

  export class ElDatePickerProOptions extends ViewComponentOptions {
    @Prop({
      group: '数据属性',
      title: '区间选择',
      description: '是否支持进行时间区间选择，关闭则为时间点选择',
      setter: {
        concept: 'SwitchSetter',
      },
      onChange: [{ clear: ['placeholderRight'] }],
    })
    range: nasl.core.Boolean = false;

    @Prop<ElDatePickerProOptions, 'value'>({
      group: '主要属性',
      title: '值',
      description: '选中值',
      setter: { concept: 'InputSetter' },
      if: (_) => _.range === false,
    })
    value: nasl.core.String | nasl.core.Integer | nasl.core.Date;

    @Prop<ElDatePickerProOptions, 'startDate'>({
      group: '主要属性',
      title: '起始值',
      description: '开始日期',
      setter: { concept: 'InputSetter' },
      if: (_) => !!_.range,
    })
    startDate: nasl.core.String | nasl.core.Integer | nasl.core.Date;

    @Prop<ElDatePickerProOptions, 'endDate'>({
      group: '主要属性',
      title: '结束值',
      description: '结束日期',
      setter: { concept: 'InputSetter' },
      if: (_) => !!_.range,
    })
    endDate: nasl.core.String | nasl.core.Integer | nasl.core.Date;

    @Prop({
      group: '主要属性',
      title: '允许输入',
      description: '是否允许输入日期',
      setter: { concept: 'SwitchSetter' },
    })
    allowInput: nasl.core.Boolean = false;

    @Prop({
      group: '样式属性',
      title: '无边框',
      description: '无边框模式',
      setter: { concept: 'SwitchSetter' },
    })
    borderless: nasl.core.Boolean = false;

    @Prop({
      group: '主要属性',
      title: '可清除',
      description: '是否显示清除按钮',
      setter: { concept: 'SwitchSetter' },
    })
    clearable: nasl.core.Boolean = false;

    @Prop({
      group: '数据属性',
      title: '最小日期值',
      description: '最小可选的日期值，默认为10年前，日期填写格式为“yyyy-mm-dd”',
      docDescription: '设置日期范围，支持输入的最小日期',
    })
    minDate:
      | nasl.core.String
      | nasl.core.Integer
      | nasl.core.Date
      | nasl.core.DateTime;

    @Prop({
      group: '数据属性',
      title: '最大日期值',
      description: '最大可选的日期值，默认为9年后，日期填写格式为“yyyy-mm-dd”',
      docDescription: '设置日期范围，支持输入的最大日期',
    })
    maxDate:
      | nasl.core.String
      | nasl.core.Integer
      | nasl.core.Date
      | nasl.core.DateTime;

    @Prop({
      group: '状态属性',
      title: '禁用',
      description: '是否禁用组件',
      setter: { concept: 'SwitchSetter' },
    })
    disabled: nasl.core.Boolean;

    @Prop({
      group: '状态属性',
      title: '只读',
      description: '只读状态',
      setter: { concept: 'SwitchSetter' },
    })
    readonly: nasl.core.Boolean;

    @Prop({
      group: '主要属性',
      title: '日期类型',
      description: '选择器模式。可选项：year/quarter/month/week/date',
      setter: {
        concept: 'EnumSelectSetter',
        options: [
          { title: '年份' },
          { title: '季度' },
          { title: '月份' },
          { title: '周' },
          { title: '日期' },
        ],
      },
    })
    mode: 'year' | 'quarter' | 'month' | 'week' | 'date' = 'date';

    @Prop({
      group: '主要属性',
      title: '第一天从星期几开始',
      description: '第一天从星期几开始',
      setter: { concept: 'NumberInputSetter' },
    })
    firstDayOfWeek: nasl.core.Decimal = 7;

    @Prop<ElDatePickerProOptions, 'format'>({
      group: '主要属性',
      title: '日期展示格式',
      description:
        '仅用于格式化日期显示的格式，不影响日期值。注意和 `valueType` 的区别，`valueType`会直接决定日期值 `value` 的格式。全局配置默认为："YYYY-MM-DD"，',
      setter: {
        concept: 'EnumSelectSetter',
        options: [
          { title: '中国（2023年7月26日）', if: _ => _.mode === 'date' },
          { title: 'ISO（2023-07-26）', if: _ => _.mode === 'date' },
          { title: 'US（7/26/2023）', if: _ => _.mode === 'date' },
          { title: 'EU（26/7/2023）', if: _ => _.mode === 'date' },
          { title: '2023-28周', if: _ => _.mode === 'week' },
          { title: '2023年第28周', if: _ => _.mode === 'week' },
          { title: '2023-W28', if: _ => _.mode === 'week' },
          { title: '中国（2023年7月）', if: _ => _.mode === 'month' },
          { title: 'ISO（2023-07）', if: _ => _.mode === 'month' },
          { title: 'US/EU（7/2023）', if: _ => _.mode === 'month' },
          { title: '2023年第3季度', if: _ => _.mode === 'quarter' },
          { title: '2023年Q3', if: _ => _.mode === 'quarter' },
          { title: '2023-Q3', if: _ => _.mode === 'quarter' },
          { title: '中国（2023年）', if: _ => _.mode === 'year' },
          { title: 'ISO（2023）', if: _ => _.mode === 'year' }
      ],
      },
    })
    format: 'YYYY年M月D日' | 'YYYY-MM-DD' | 'M/D/YYYY' | 'D/M/YYYY' | 'GGGG-W周' | 'GGGG年第W周' | 'GGGG-WWWW' | 'YYYY年M月' | 'YYYY-MM' | 'M/YYYY' | 'YYYY年第Q季度' | 'YYYY年QQ' | 'YYYY-QQ' | 'YYYY年' | 'YYYY' = 'YYYY-MM-DD';

    @Prop({
      group: '主要属性',
      title: '占位符',
      description: '占位符。',
      setter: { concept: 'InputSetter' },
    })
    placeholder: nasl.core.String;

    @Prop<ElDatePickerProOptions, 'placeholderRight'>({
      group: '主要属性',
      title: '右侧占位符',
      description:
        '时间选择框无内容时的提示信息，支持自定义编辑, 在没有设置的时候使用placeholder作为右侧占位符内容',
      if: (_) => _.range === true,
      implicitToString: true,
      setter: {
        concept: 'InputSetter',
        placeholder: '同占位符一致'
      }
    })
    placeholderRight: nasl.core.String = '';

    @Prop({
      group: '主要属性',
      title: '快捷设置位置',
      description:
        '预设面板展示区域（包含确定按钮）。可选项：left/top/right/bottom',
      setter: {
        concept: 'EnumSelectSetter',
        options: [
          { title: '左侧' },
          { title: '顶部' },
          { title: '右侧' },
          { title: '底部' },
        ],
      },
    })
    presetsPlacement: 'left' | 'top' | 'right' | 'bottom' = 'bottom';

    @Prop({
      group: '样式属性',
      title: '尺寸',
      description: '输入框尺寸。可选项：small/medium/large。',
      setter: {
        concept: 'EnumSelectSetter',
        options: [
          { title: '小' },
          { title: '中' },
          { title: '大' },
        ],
      },
    })
    size:
      | 'small'
      | 'medium'
      | 'large' = 'medium';

    // @Prop({
    //   group: '主要属性',
    //   title: 'Status',
    //   description: '输入框状态。可选项：default/success/warning/error',
    //   setter: {
    //     concept: 'EnumSelectSetter',
    //     options: [
    //       { title: 'default' },
    //       { title: 'success' },
    //       { title: 'warning' },
    //       { title: 'error' },
    //     ],
    //   },
    // })
    // status: 'default' | 'success' | 'warning' | 'error' = 'default';

    // @Prop({
    //   group: '主要属性',
    //   title: 'Tips',
    //   description: '输入框下方提示文本，会根据不同的 `status` 呈现不同的样式。',
    //   setter: { concept: 'InputSetter' },
    // })
    // tips: any;

    // @Prop({
    //   group: '主要属性',
    //   title: 'Value Type',
    //   description:
    //     '用于格式化日期的值，仅支持部分格式，时间戳、日期等。⚠️ `YYYYMMDD` 这种格式不支持，请勿使用，如果希望支持可以给 `dayjs` 提个 PR。注意和 `format` 的区别，`format` 仅用于处理日期在页面中呈现的格式。`ValueTypeEnum` 即将废弃，请更为使用 `DatePickerValueType`。',
    //   setter: { concept: 'InputSetter' },
    // })
    // valueType: nasl.core.String;

    @Event({
      title: '失焦时',
      description: '当输入框失去焦点时触发',
    })
    onBlur: (event: {
      value: nasl.core.String | nasl.core.Date,
      startTime: nasl.core.String | nasl.core.Date,
      endTime: nasl.core.String | nasl.core.Date,
      position: 'start' | 'end',
     }) => any;

    @Event({
      title: '值改变时',
      description: '选中值发生变化时触发。',
    })
    onChange: (event: {
      value: nasl.core.String | nasl.core.Date,
      startTime: nasl.core.String | nasl.core.Date,
      endTime: nasl.core.String | nasl.core.Date,
     }) => any;

    @Event({
      title: '点击确认按钮时',
      description: '如果存在“确定”按钮，则点击“确定”按钮时触发',
    })
    onConfirm: (event: {
      value: nasl.core.String | nasl.core.Date,
      startTime: nasl.core.String | nasl.core.Date,
      endTime: nasl.core.String | nasl.core.Date,
      position: 'start' | 'end',
     }) => any;

    @Event({
      title: '聚焦时',
      description: '输入框获得焦点时触发',
    })
    onFocus: (event: {
      value: nasl.core.String | nasl.core.Date,
      startTime: nasl.core.String | nasl.core.Date,
      endTime: nasl.core.String | nasl.core.Date,
      position: 'start' | 'end',
     }) => any;

    @Event({
      title: '面板选中后',
      description: '面板选中值后触发',
    })
    onPick: (event: {
      value: nasl.core.String | nasl.core.Date,
      startTime: nasl.core.String | nasl.core.Date,
      endTime: nasl.core.String | nasl.core.Date,
      position: 'start' | 'end',
     }) => any;

    // @Event({
    //   title: '点击预设按钮后',
    //   description: '点击预设按钮后触发',
    // })
    // onPresetClick: (event: {
    //   value: nasl.core.String | nasl.core.Date,
    //   startTime: nasl.core.String | nasl.core.Date,
    //   endTime: nasl.core.String | nasl.core.Date,
    //   position: 'start' | 'end',
    //  }) => any;
  }
}
