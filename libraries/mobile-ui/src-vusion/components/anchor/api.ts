/// <reference types="@nasl/types" />

namespace nasl.ui {
    @Component({
        title: '锚点',
        icon: 'anchor',
        description: '锚点',
        group: "Navigation"
    })
    export class VanAnchor extends ViewComponent {

        constructor(options?: Partial<VanAnchorOptions>) { super(); }
    }

    export class VanAnchorOptions extends ViewComponentOptions {
        @Prop({
            group: '数据属性',
            title: '标识',
            description: '锚点的唯一标识，用于跳转链接，如“/page#linkname”',
            docDescription: '锚点的唯一标识，用于跳转链接，标识为空时，默认将组件名作为标识',
            implicitToString: true,
        })
        label: nasl.core.String;

        @Slot({
          title: '默认',
          description: '内容',
        })
        slotDefault: () => Array<ViewComponent>;
    }
}
