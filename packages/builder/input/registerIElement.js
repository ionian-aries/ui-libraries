/* eslint-disable no-cond-assign, no-multi-assign, no-restricted-syntax, no-use-before-define */

export default function registerIElement(methods, options = {}) {
  // inspecting element 模式
  let inspecting = false;
  // 当前组件的主要选择器
  let mainSelectors = [];
  let mainSelectorStr = '';
  // 当前组件的所有选择器
  let selectors = [];
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
  // 唯一审查的元素
  let tempElement = null;
  // 审查器popover
  let INSPECTOR = null;

  options.postMessage = options.postMessage || ((payload) => window.top.postMessage(payload, '*'));

  function initInspector() {
    INSPECTOR = document.getElementById('ide-inspector');
    if (INSPECTOR) return;

    INSPECTOR = document.createElement('div');
    INSPECTOR.id = 'ide-inspector';
    INSPECTOR.classList.add('ide-inspector');
    if (!options.addPopoverManually) {
      INSPECTOR.innerHTML = `<div class="ide-inspector__popover">
          <div class="ide-inspector__title"></div>
          <div class="ide-inspector__content"></div>
      </div>`;
    }
    document.body.appendChild(INSPECTOR);

    if (!options.addEventsManually) {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.addEventListener('scroll', onScrollOrResize);
      window.addEventListener('resize', onScrollOrResize);
    }
  }
  initInspector();

  function computeInspector() {
    const el = tempElement;
    if (!el) {
      INSPECTOR.style.display = 'none';
      return;
    }

    const rect = el.getBoundingClientRect();
    if (!options.addPopoverManually) {
      INSPECTOR.children[0].children[0].textContent = el.tagName.toLowerCase() + Array.from(el.classList).map((cls) => `.${cls}`).join('');
      INSPECTOR.children[0].children[1].textContent = `${rect.width.toFixed(1)}px × ${rect.height.toFixed(1)}px`;

      if (rect.top < 80) {
        INSPECTOR.children[0].setAttribute('data-placement', 'bottom');
      } else {
        INSPECTOR.children[0].setAttribute('data-placement', 'top');
      }
    }

    Object.assign(INSPECTOR.style, {
      display: 'block',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    const payload = { from: 'lcap-theme', type: 'iElementRect', data: rect };
    options.postMessage(payload);
  }

  function sendIElementResult() {
    // eslint-disable-next-line no-use-before-define
    selectedElementResult = getIElementResult();
    const payload = { from: 'lcap-theme', type: 'iElementResult', data: selectedElementResult };
    options.postMessage(payload);
  }

  function onMouseMove(e) {
    if (!inspecting || !INSPECTOR) return;

    tempElement = e.target.closest(mainSelectorStr);
    if (!tempElement) {
      INSPECTOR.style.display = 'none';
    } else {
      computeInspector();
    }
  }

  function onClick(e) {
    if (!inspecting) return;
    selectedElement = tempElement;
    methods.cancelIElement();
    sendIElementResult();

    e.stopPropagation();
  }

  function onScrollOrResize(e) {
    computeInspector();
  }

  methods.inspectElement = (data) => {
    inspecting = true;
    mainSelectors = data.mainSelectors;
    mainSelectorStr = mainSelectors.join(',');
    selectors = data.selectors;
    if (!options.addEventsManually) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('click', onClick);
    }
  };

  methods.cancelIElement = () => {
    inspecting = false;
    if (!options.addEventsManually) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    }
  };

  methods.clearIElement = () => {
    mainSelectors = [];
    selectors = [];
    selectedElement = null;
    selectedElementState = '';
    selectedElementResult = {
      matchedSelectors: [],
      has: {
        parent: false, prev: false, next: false, children: false,
      },
    };
    tempElement = null;
  };

  function getRelatedElement(el, relation) {
    if (!el) return undefined;

    if (relation === 'self') {
      return el;
    } if (relation === 'parent') {
      return el.parentElement.closest(mainSelectorStr);
    } if (relation === 'prev') {
      while (el = el.previousElementSibling) {
        if (el.matches(mainSelectorStr)) return el;
      }
    } else if (relation === 'next') {
      while (el = el.nextElementSibling) {
        if (el.matches(mainSelectorStr)) return el;
      }
    } else if (relation === 'children') {
      for (const child of el.children) {
        if (child.matches(mainSelectorStr)) return child;
      }
    }
    return undefined;
  }

  function getIElementResult() {
    const el = tempElement;
    const filterText = !selectedElementState ? '' : `:${selectedElementState}`;
    const matchedSelectors = !el ? [] : selectors.filter((selector) => selector.includes(filterText) && el.matches(selector));

    return {
      matchedSelectors,
      has: {
        parent: !!getRelatedElement(el, 'parent'),
        prev: !!getRelatedElement(el, 'prev'),
        next: !!getRelatedElement(el, 'next'),
        children: !!getRelatedElement(el, 'children'),
      },
    };
  }

  methods.hoverIElement = (relation) => {
    tempElement = getRelatedElement(selectedElement, relation);
    computeInspector();
  };

  methods.switchIElement = (relation) => {
    selectedElement = tempElement = getRelatedElement(selectedElement, relation);
    computeInspector();
    sendIElementResult();
  };

  methods.changeIElementState = (state) => {
    selectedElementState = state;
    sendIElementResult();
  };

  methods.showInspector = () => {
    INSPECTOR.style.display = 'block';
  };

  methods.hideInspector = () => {
    INSPECTOR.style.display = 'none';
  };

  return {
    get inspecting() {
      return inspecting;
    },
    onMouseMove,
    onClick,
  };
}

/* debug
$('iframe').contentWindow.postMessage({ from: 'lcap', type: 'inspectElement', data: {
  selectors: [
    '[class*=u-panel__]',
    '[class*=u-panel__][shadow=always]',
    '[class*=u-panel__][shadow=hover]:hover,[class*=u-panel__][shadow=hover]._hover',
    '[class*=u-panel__][shadow=always],[class*=u-panel__][shadow=hover]',
    '[class*=u-panel__][shadow=never]',
    '[class*=u-panel__][bordered]',
    '[class*=u-panel_head__]',
    '[class*=u-panel_title__]',
    '[class*=u-panel_extra__]',
    '[class*=u-panel_body__]',
    '[class*=u-panel_title__] [s-empty]',
    '[class*=u-panel_head__][flex]',
    '[class*=u-panel_head__][flex] [class*=u-panel_extra__]',
    '[class*=u-panel_group__]:not(:last-child)',
    '[class*=u-panel_group_head__]',
    '[class*=u-panel_group_body__]',
    '[class*=u-panel__]:hover,[class*=u-panel__]._hover',
    '[class*=u-panel__]:active,[class*=u-panel__]._active',
    '[class*=u-panel__]:focus,[class*=u-panel__]._focus',
    '[class*=u-panel_head__]:hover,[class*=u-panel_head__]._hover',
    '[class*=u-panel_head__]:active,[class*=u-panel_head__]._active',
    '[class*=u-panel_head__]:focus,[class*=u-panel_head__]._focus',
    '[class*=u-panel_title__]:hover,[class*=u-panel_title__]._hover',
    '[class*=u-panel_title__]:active,[class*=u-panel_title__]._active',
    '[class*=u-panel_title__]:focus,[class*=u-panel_title__]._focus',
    '[class*=u-panel_extra__]:hover,[class*=u-panel_extra__]._hover',
    '[class*=u-panel_extra__]:active,[class*=u-panel_extra__]._active',
    '[class*=u-panel_extra__]:focus,[class*=u-panel_extra__]._focus',
    '[class*=u-panel_body__]:hover,[class*=u-panel_body__]._hover',
    '[class*=u-panel_body__]:active,[class*=u-panel_body__]._active',
    '[class*=u-panel_body__]:focus,[class*=u-panel_body__]._focus',
    '[class*=u-panel_title__] [s-empty]:hover,[class*=u-panel_title__] [s-empty]._hover',
    '[class*=u-panel_title__] [s-empty]:active,[class*=u-panel_title__] [s-empty]._active',
    '[class*=u-panel_title__] [s-empty]:focus,[class*=u-panel_title__] [s-empty]._focus',
    '[class*=u-panel_group__]',
    '[class*=u-panel_group__]:hover,[class*=u-panel_group__]._hover',
    '[class*=u-panel_group__]:active,[class*=u-panel_group__]._active',
    '[class*=u-panel_group__]:focus,[class*=u-panel_group__]._focus',
    '[class*=u-panel_group_head__]:hover,[class*=u-panel_group_head__]._hover',
    '[class*=u-panel_group_head__]:active,[class*=u-panel_group_head__]._active',
    '[class*=u-panel_group_head__]:focus,[class*=u-panel_group_head__]._focus',
    '[class*=u-panel_group_body__]:hover,[class*=u-panel_group_body__]._hover',
    '[class*=u-panel_group_body__]:active,[class*=u-panel_group_body__]._active',
    '[class*=u-panel_group_body__]:focus,[class*=u-panel_group_body__]._focus'],
  mainSelectors: [
    '[class*=u-panel__]',
    '[class*=u-panel_head__]',
    '[class*=u-panel_title__]',
    '[class*=u-panel_extra__]',
    '[class*=u-panel_body__]',
    '[class*=u-panel_title__] [s-empty]',
    '[class*=u-panel_head__] [class*=u-panel_extra__]',
    '[class*=u-panel_group__]',
    '[class*=u-panel_group_head__]',
    '[class*=u-panel_group_body__]',
  ],
} }, '*');

$('iframe').contentWindow.postMessage({ from: 'lcap', type: 'switchIElement', data: 'next' }, '*');
*/
