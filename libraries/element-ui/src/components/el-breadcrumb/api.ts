/// <reference types="@nasl/types" />

namespace nasl.ui {
  @IDEExtraInfo({
    order: 1,
    ideusage: {
      idetype: 'container',
      structured: true,
      childAccept: "target.tag === 'el-breadcrumb-item'",
      forceUpdateWhenAttributeChange: true,
      additionalAttribute: {
        ':showInDesiner': true,
      },
      "displaySlotInline": {
        default: true,
      },
    },
  })
  @Component({
    title: '面包屑',
    icon: 'crumb',
    description: '显示当前页面的路径，快速返回之前的任意页面。',
    group: 'Navigation',
  })
  export class ElBreadcrumb extends ViewComponent {
    constructor(options?: Partial<ElBreadcrumbOptions>) {
      super();
    }
  }

  export class ElBreadcrumbOptions extends ViewComponentOptions {
    @Prop({
      group: '主要属性',
      title: '分隔符',
      description: '分隔符',
      setter: { concept: 'InputSetter' },
    })
    separator: nasl.core.String = '/';

    @Prop({
      group: '主要属性',
      title: '自动生成',
      description: '是否自动根据子页面配置的面包屑属性自动生成',
      docDescription: '支持控制面包屑生成方式。',
      setter: {
        concept: 'SwitchSetter',
      },
      bindHide: true,
    })
    auto: nasl.core.Boolean = false;

    @Slot({
      title: '内容',
      description: '内容',
      emptyBackground: 'add-sub',
      snippets: [
        {
          title: '面包屑项',
          code: '<el-breadcrumb-item><template #default><el-text text="面包屑"></el-text></template></el-breadcrumb-item>',
        },
      ],
    })
    slotDefault: () => Array<ViewComponent>;
  }

  @IDEExtraInfo({
    ideusage: {
      idetype: 'container',
      "displaySlotInline": {
        default: true,
      },
    },
  })
  @Component({
    title: '面包屑项',
    description: '面包屑项',
  })
  export class ElBreadcrumbItem extends ViewComponent {
    constructor(options?: Partial<ElBreadcrumbItemOptions>) {
      super();
    }
  }

  export class ElBreadcrumbItemOptions extends ViewComponentOptions {
    @Prop({
      group: '交互属性',
      title: '链接地址'
    })
    hrefAndTo: nasl.core.String;

    @Prop({
      group: '主要属性',
      title: '替换路由',
      description:
        '在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录',
      setter: { concept: 'SwitchSetter' },
    })
    replace: nasl.core.Boolean = false;

    @Event({
      title: '点击',
      description: '在元素上按下并释放任意鼠标按钮时触发。',
    })
    onClick: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '双击',
      description: '在元素上双击鼠标按钮时触发。',
    })
    onDblclick: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '右键点击',
      description: '在右键菜单显示前触发。',
    })
    onContextmenu: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '鼠标按下',
      description: '在元素上按下任意鼠标按钮时触发。',
    })
    onMousedown: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '鼠标释放',
      description: '在元素上释放任意鼠标按钮时触发。',
    })
    onMouseup: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '鼠标移入',
      description: '鼠标移入元素时触发。',
    })
    onMouseenter: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '鼠标移出',
      description: '鼠标移出元素时触发。',
    })
    onMouseleave: (event: {
      altKey: nasl.core.Boolean;
      button: nasl.core.Integer;
      clientX: nasl.core.Integer;
      clientY: nasl.core.Integer;
      ctrlKey: nasl.core.Boolean;
      metaKey: nasl.core.Boolean;
      movementX: nasl.core.Integer;
      movementY: nasl.core.Integer;
      offsetX: nasl.core.Integer;
      offsetY: nasl.core.Integer;
      pageX: nasl.core.Integer;
      pageY: nasl.core.Integer;
      screenX: nasl.core.Integer;
      screenY: nasl.core.Integer;
      which: nasl.core.Integer;
    }) => any;

    @Event({
      title: '聚焦时',
      description: '聚焦时触发',
    })
    onFocus: (event: {}) => void;

    @Event({
      title: '失焦时',
      description: '失焦时触发',
    })
    onBlur: (event: {}) => void;

    @Slot({
      title: '内容',
      description: '内容',
    })
    slotDefault: () => Array<ViewComponent>;
  }
}
