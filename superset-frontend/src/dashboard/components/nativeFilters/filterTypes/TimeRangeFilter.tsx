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
import React, { FC, useState, Fragment } from 'react';
import {
  Select,
  DatePicker,
  Form,
  Space,
  InputNumber,
} from 'src/common/components';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import { t } from '@superset-ui/core';
import { AntCallback } from '../types';

enum TimeRelations {
  last = 'last',
  next = 'next',
}

const TimeRelationNames = {
  [TimeRelations.last]: t('Last'),
  [TimeRelations.next]: t('Next'),
};

enum TimeFrames {
  'noTimeRange' = 'noTimeRange',
  'lastDay' = 'lastDay',
  'lastWeek' = 'lastWeek',
  'lastMonth' = 'lastMonth',
  'lastQuarter' = 'lastQuarter',
  'lastYear' = 'lastYear',
  'relativeToToday' = 'relativeToToday',
  'startEnd' = 'startEnd',
}

const TimeFrameNames = {
  [TimeFrames.noTimeRange]: t('No Time Range'),
  [TimeFrames.lastDay]: t('Last day'),
  [TimeFrames.lastWeek]: t('Last week'),
  [TimeFrames.lastMonth]: t('Last month'),
  [TimeFrames.lastQuarter]: t('Last quarter'),
  [TimeFrames.lastYear]: t('Last year'),
  [TimeFrames.relativeToToday]: t('Relative to Today'),
  [TimeFrames.startEnd]: t('Start / End'),
};

enum TimeGrains {
  'seconds' = 'seconds',
  'minutes' = 'minutes',
  'hours' = 'hours',
  'days' = 'days',
  'weeks' = 'weeks',
  'months' = 'months',
  'years' = 'years',
}

const TimeGrainNames = {
  [TimeGrains.seconds]: t('seconds'),
  [TimeGrains.minutes]: t('minutes'),
  [TimeGrains.hours]: t('hours'),
  [TimeGrains.days]: t('days'),
  [TimeGrains.weeks]: t('weeks'),
  [TimeGrains.months]: t('months'),
  [TimeGrains.years]: t('years'),
};

const MOMENT_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

const DEFAULT_SINCE = moment()
  .utc()
  .startOf('day')
  .subtract(7, 'days')
  .format(MOMENT_FORMAT);

const DEFAULT_UNTIL = moment()
  .utc()
  .startOf('day')
  .format(MOMENT_FORMAT);

const SEPARATOR = ' : ';

const FREEFORM_TOOLTIP = t(
  'Superset supports smart date parsing. Strings like `3 weeks ago`, `last sunday`, or `2 weeks from now` can be used.',
);

type TimeRangeProps = {
  form: any;
};

const TimeRange: FC<TimeRangeProps> = ({ form }) => {
  const [timeRangeType, setTimeRangeType] = useState<TimeFrames>(
    TimeFrames.noTimeRange,
  );
  const [timeRelation, setTimeRelation] = useState<TimeRelations>(
    TimeRelations.last,
  );
  const [timePeriod, setTimePeriod] = useState<number>(7);
  const [timeGrain, setTimeGrains] = useState<TimeGrains>(TimeGrains.days);
  const handleTimeRangeTypeChange = (value: TimeFrames) => {
    setTimeRangeType(value);
    if (value !== TimeFrames.relativeToToday && value !== TimeFrames.startEnd) {
      form.setFieldsValue({
        defaultValue: {
          timeRangeType: value,
          timeRange: value,
        },
      });
    }
  };
  return (
    <Fragment>
      <Form.Item hidden name="defaultValue" />
      <Form.Item
        name="timeRangeType"
        initialValue={timeRangeType}
        label={t('Default Time Range')}
        rules={[{ required: true }]}
      >
        <Select onChange={handleTimeRangeTypeChange as AntCallback}>
          {Object.values(TimeFrames).map(timeFrame => (
            <Select.Option value={timeFrame}>
              {TimeFrameNames[timeFrame]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {timeRangeType === TimeFrames.startEnd && (
        <Form.Item
          rules={[{ required: true }]}
          label={TimeFrameNames[TimeFrames.startEnd]}
        >
          <DatePicker.RangePicker showTime format={MOMENT_FORMAT} />
        </Form.Item>
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
                <Select.Option value={relation}>
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
                <Select.Option value={grain}>
                  {TimeGrainNames[grain]}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Form.Item>
      )}
    </Fragment>
  );
};

export default TimeRange;
