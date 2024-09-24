import { _ as _defineProperty } from '../_chunks/dep-a77ab85e.js';
import { _ as _objectWithoutProperties } from '../_chunks/dep-0acb3ad3.js';
import Vue from 'vue';
import IconBase from '../icon.js';
import useSizeProps from '../utils/use-size-props.js';
import 'classnames';
import '../utils/use-common-classname.js';
import '../utils/config-context.js';

var _excluded = ["size"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var element = {
  "tag": "svg",
  "attrs": {
    "fill": "none",
    "viewBox": "0 0 24 24",
    "width": "1em",
    "height": "1em"
  },
  "children": [{
    "tag": "g",
    "attrs": {
      "clipPath": "url(#clip0_8726_7305)"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "fill": "currentColor",
        "d": "M8 3.99A3 3 0 0114 4h6v6a3 3 0 01.01 6l.05 2.52L18 16.4V14h2a1 1 0 100-2h-2V6h-6V4a1 1 0 10-2 0v2H7.59L5.53 3.94 8 4zm-7-2.4L22.41 23 21 24.41 18.59 22h-5l-.12-.86a2.5 2.5 0 00-4.94 0L8.4 22H2v-6.4l.86-.13a2.5 2.5 0 000-4.94L2 10.4V5.41L-.41 3 1 1.59zM4 7.4v1.35a4.5 4.5 0 010 8.48V20h2.76a4.5 4.5 0 018.48 0h1.35L4 7.41z"
      }
    }]
  }]
};
var ExtensionOff = Vue.extend({
  name: "ExtensionOffIcon",
  functional: true,
  props: {
    size: {
      type: String
    },
    onClick: {
      type: Function
    }
  },
  render: function render(createElement, context) {
    var props = context.props,
      data = context.data;
    var size = props.size,
      otherProps = _objectWithoutProperties(props, _excluded);
    var _useSizeProps = useSizeProps(size),
      className = _useSizeProps.className,
      style = _useSizeProps.style;
    var fullProps = _objectSpread(_objectSpread({}, otherProps || {}), {}, {
      id: "extension-off",
      icon: element,
      staticClass: className,
      style: style
    });
    data.props = fullProps;
    return createElement(IconBase, data);
  }
});

export default ExtensionOff;
//extension-off.js.map