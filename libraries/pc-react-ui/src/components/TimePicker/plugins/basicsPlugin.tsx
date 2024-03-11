import classnames from 'classnames';
import dayjs from 'dayjs';
import { useControllableValue } from 'ahooks';
import _ from 'lodash';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import style from '../index.module.less';
import 'dayjs/locale/zh-cn';

export function useHandleLocale() {
  return {
    locale,
  };
}
export function useHandleValue(props) {
  const valueProps = props.get('value');
  const onChangeProps = props.get('onChange', () => { });
  const valueFormat = _.isNil(valueProps) ? valueProps : dayjs(valueProps, 'HH:mm:ss');
  const [value, onChange] = useControllableValue(_.filterUnderfinedValue({ value: valueFormat }));
  return {
    value,
    onChange(time) {
      const formatTime = _.isNil(time) ? time : time?.format('HH:mm:ss');
      _.attempt(onChangeProps, formatTime);
      onChange(value);
    },
  };
}
export function useHandleStyle(props) {
  const className = props.get('className');
  return {
    className: classnames(style.timePicker, className),
  };
}
