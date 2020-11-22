/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t, styled } from '@superset-ui/core';
import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import {
  DatePicker,
  Form,
  Space,
  Switch,
  Input,
  Tooltip,
} from '../../../../../common/components';
import { TimeFrameNames, TimeFrames } from './types';
import { AntCallback, Filter } from '../../types';

const MOMENT_FORMAT_UI = 'YYYY-MM-DD HH:mm:ss';
const MOMENT_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

const START_END_TOOLTIP = t(
  'Superset supports smart date parsing. Strings like `3 weeks ago`, `last sunday`, or `2 weeks from now` can be used.',
);

const StyledSwitch = styled(Switch)`
  width: 80px;
`;

const CONNECTOR_WIDTH = 32;
export const SEPARATOR = ' : ';

const Connector = styled(Input)`
  &&& {
    width: ${CONNECTOR_WIDTH}px;
    border-left: 0;
    border-right: 0;
    pointer-events: none;
    background-color: ${({ theme }) => theme.colors.grayscale.light5};
  }
`;

const StyledInput = styled(Input)`
  &&& {
    width: calc(50% - ${CONNECTOR_WIDTH / 2}px);
  }
`;

const RightInput = styled(StyledInput)`
  &&& {
    border-left-width: 0;
    &:hover {
      border-left-width: 1px;
    }
    &:focus {
      border-left-width: 1px;
    }
  }
`;

const LineFormItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
  }
`;

type StartEndProps = {
  setFieldValue: Function;
  filterToEdit?: Filter;
};

const StartEnd: FC<StartEndProps> = ({ setFieldValue, filterToEdit }) => {
  const [initStart, initEnd] =
    filterToEdit?.defaultValue?.timeRange.split(SEPARATOR) || [];
  const [start, setStart] = useState<string>(initStart);
  const [end, setEnd] = useState<string>(initEnd);
  const [smartMode, setSmartMode] = useState<boolean>(
    initStart !== undefined && !moment(initStart).isValid(),
  );

  useEffect(() => {
    setFieldValue(`${start}${SEPARATOR}${end}`);
  }, [start, end, setFieldValue]);

  return (
    <LineFormItem
      rules={[{ required: true }]}
      label={TimeFrameNames[TimeFrames.startEnd]}
    >
      <Space align="center">
        {smartMode ? (
          <Input.Group compact>
            <StyledInput
              defaultValue={start}
              placeholder={t('3 weeks ago')}
              onChange={e => setStart(e.target.value)}
            />
            <Connector placeholder="~" disabled />
            <RightInput
              defaultValue={end}
              placeholder={t('last day')}
              onChange={e => setEnd(e.target.value)}
            />
          </Input.Group>
        ) : (
          <DatePicker.RangePicker
            // @ts-ignore
            defaultValue={[moment(start), moment(end)]}
            allowEmpty={[true, true]}
            showTime
            format={MOMENT_FORMAT_UI}
            onChange={dates =>
              setFieldValue(
                dates
                  ? `${dates[0]?.format(
                      MOMENT_FORMAT,
                    )}${SEPARATOR}${dates[1]?.format(MOMENT_FORMAT)}`
                  : SEPARATOR,
              )
            }
          />
        )}
        <Tooltip placement="top" title={START_END_TOOLTIP}>
          <StyledSwitch
            checkedChildren={t('Smart')}
            unCheckedChildren={t('Dates')}
            onChange={setSmartMode as AntCallback}
          />
        </Tooltip>
      </Space>
    </LineFormItem>
  );
};

export default StartEnd;
