/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import 'remixicon/fonts/remixicon.css';

import classnames from 'classnames';
import { Flex, Text } from '@/index';

export function Icon(props) {
  // https://remixicon.com/
  // https://remixicon.com/icon/arrow-right-up-line
  const name = props.name ?? 'RiNeteaseCloudMusicLine';
  const className = classnames('anticon', _.kebabCase(name), props.className);
  if (name?.includes('.svg')) {
    return <img {...props} src={name} width={20} alt="icon" className={classnames('anticon', props.className)} />;
  }
  return (
    <i {...props} className={className} />
  );
}
interface IconProps {
  iconName: string
}
