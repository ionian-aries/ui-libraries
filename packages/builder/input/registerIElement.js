export default function registerIElement(methods) {
  // inspecting element 模式
  let inspecting = false;
  // 当前组件名称
  let componentName;
  // 当前组件选择器
  let componentSelectors = [];
  // 当前选中的元素
  let selectedElement = null;
  // 当前选中的元素状态
  let selectedElementState = '';
  // 当前选中的元素结果
  let selectedElementResult = {
    matchedSelectors: [],
    has: {
      parent: false, prev: false, next: false, children: false,
    },
  };
  // 当前 hover 的元素
  let hoveredElement = null;
  // 是否高亮
  let highlighting = false;
  // 审查器popover
  let INSPECTOR = null;

  function initInspector() {
    INSPECTOR = document.createElement('div');
    INSPECTOR.classList.add('ide-inspector');
    INSPECTOR.innerHTML = `<div class="ide-inspector__popover">
        <div class="ide-inspector__title"></div>
        <div class="ide-inspector__content"></div>
    </div>`;
    document.body.appendChild(INSPECTOR);
  }
  initInspector();

  function sendIElementResult() {
    // eslint-disable-next-line no-use-before-define
    selectedElementResult = getIElementResult();
    window.top.postMessage({ from: 'lcap-theme', type: 'iElementResult', data: selectedElementResult }, '*');
  }

  function onMouseMove(e) {
    if (!inspecting || !INSPECTOR) return;
    hoveredElement = e.target;

    const componentElement = hoveredElement; // target.closest('.ide-subview'); // @TODO: 替换成当前选中的组件
    if (!componentElement) { // !document.body.contains(target)) {
      INSPECTOR.style.display = 'none';
    } else {
      const rect = hoveredElement.getBoundingClientRect();
      INSPECTOR.children[0].children[0].textContent = hoveredElement.tagName.toLowerCase() + Array.from(hoveredElement.classList).map((cls) => `.${cls}`).join('');
      INSPECTOR.children[0].children[1].textContent = `${rect.width}px × ${rect.height}px`;

      Object.assign(INSPECTOR.style, {
        display: 'block',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    }
  }

  function onClick(e) {
    if (!inspecting) return;
    methods.cancelIElement();
    sendIElementResult();
  }

  methods.inspectElement = (data) => {
    inspecting = true;
    componentName = data.componentName;
    componentSelectors = data.componentSelectors;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
  };

  methods.cancelIElement = () => {
    inspecting = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('click', onClick);
  };

  methods.clearIElement = (data) => {
    componentName = undefined;
    componentSelectors = [];
    selectedElement = null;
    selectedElementState = '';
    selectedElementResult = {
      matchedSelectors: [],
      has: {
        parent: false, prev: false, next: false, children: false,
      },
    };
    hoveredElement = null;
    highlighting = false;
  };

  function getIElementResult() {
    const el = hoveredElement;
    const filterText = !selectedElementState ? '' : `:${selectedElementState}`;
    const matchedSelectors = componentSelectors.filter((selector) => selector.includes(filterText) && el.matches(selector));

    return {
      matchedSelectors,
      has: {
        parent: !!el.parentElement,
        prev: !!el.previousElementSibling,
        next: !!el.nextElementSibling,
        children: !!el.children.length,
      },
    };
  }

  methods.hoverIElement = (data) => {
    //
  };

  methods.switchIElement = (data) => {
    //
    sendIElementResult();
  };

  methods.changeIElementState = (data) => {
    selectedElementState = data;
    sendIElementResult();
  };

  methods.removeHighlight = () => {
  };

  methods.resumeHighlight = () => {
  };
}

// debug
// $('iframe').contentWindow.postMessage({ from: 'lcap', type: 'inspectElement', data: { componentName: 'u-button', componentSelectors: [] } }, '*');
