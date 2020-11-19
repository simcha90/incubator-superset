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
import React, { FC, useState, useEffect } from 'react';
import { Select, Form, Space, InputNumber } from 'src/common/components';
import 'react-datetime/css/react-datetime.css';
import { t } from '@superset-ui/core';
import { AntCallback } from '../../types';
import StartEnd, { SEPARATOR } from './StartEnd';
import {
  TimeFrameNames,
  TimeFrames,
  TimeGrainNames,
  TimeGrains,
  TimeRelationNames,
  TimeRelations,
} from './types';

type TimeRangeFilterProps = {
  form: any;
};

type TimeRangeValue = {
  timeRangeType: TimeFrames;
  timeRange?: string;
};

const TimeRangeFilter: FC<TimeRangeFilterProps> = ({ form }) => {
  const [timeRangeType, setTimeRangeType] = useState<TimeFrames>(
    TimeFrames.noTimeRange,
  );
  const [timeRelation, setTimeRelation] = useState<TimeRelations>(
    TimeRelations.last,
  );
  const [timePeriod, setTimePeriod] = useState<number>(7);
  const [timeGrain, setTimeGrains] = useState<TimeGrains>(TimeGrains.days);
  const [startEnd, setStartEnd] = useState<string>(SEPARATOR);

  useEffect(() => {
    const defaultValue: TimeRangeValue = {
      timeRangeType,
    };
    if (timeRangeType === TimeFrames.relativeToToday) {
      defaultValue.timeRange = `${timeRelation} ${timePeriod} ${timeGrain}`;
    } else if (timeRangeType === TimeFrames.startEnd) {
      defaultValue.timeRange = startEnd;
    } else {
      defaultValue.timeRange = timeRangeType;
    }

    form.setFieldsValue({
      defaultValue,
    });
  }, [timeRelation, timePeriod, timeGrain, form, timeRangeType, startEnd]);

  return (
    <>
      <Form.Item hidden name="defaultValue" key="defaultValue" />
      <Form.Item
        key="timeRangeType"
        name="timeRangeType"
        initialValue={timeRangeType}
        label={t('Default Time Range')}
        rules={[{ required: true }]}
      >
        <Select onChange={setTimeRangeType as AntCallback}>
          {Object.values(TimeFrames).map(timeFrame => (
            <Select.Option value={timeFrame} key={timeFrame}>
              {TimeFrameNames[timeFrame]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {timeRangeType === TimeFrames.startEnd && (
        <StartEnd setStartEnd={setStartEnd} />
      )}
      {timeRangeType === TimeFrames.relativeToToday && (
        <Form.Item
          rules={[{ required: true }]}
          label={TimeFrameNames[TimeFrames.relativeToToday]}
        >
          <Space>
            <Select
              defaultValue={timeRelation}
              onChange={setTimeRelation as AntCallback}
            >
              {Object.values(TimeRelations).map(relation => (
                <Select.Option value={relation} key={relation}>
                  {TimeRelationNames[relation]}
                </Select.Option>
              ))}
            </Select>
            <InputNumber
              min={1}
              defaultValue={timePeriod}
              onChange={setTimePeriod as AntCallback}
            />
            <Select
              defaultValue={timeGrain}
              onChange={setTimeGrains as AntCallback}
            >
              {Object.values(TimeGrains).map(grain => (
                <Select.Option value={grain} key={grain}>
                  {TimeGrainNames[grain]}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Form.Item>
      )}
    </>
  );
};

export default TimeRangeFilter;
