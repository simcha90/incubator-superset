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
import React, { FC, useState } from 'react';
import { Form, Select, FormInstance } from 'src/common/components';
import 'react-datetime/css/react-datetime.css';
import { t } from '@superset-ui/core';
import { AntCallback, Filter } from '../../types';
import StartEnd from './StartEnd';
import { TimeFrameNames, TimeFrames } from './types';
import { setFilterFieldValues } from '../../utils';
import RelativeToToday from './RaltiveToToday';

type TimeRangeFilterProps = {
  filterToEdit?: Filter;
  form: FormInstance;
  filterId: string;
};

type TimeRangeValue = {
  timeRangeType: TimeFrames;
  timeRange?: string;
};

const TimeRangeFilter: FC<TimeRangeFilterProps> = ({
  form,
  filterToEdit,
  filterId,
}) => {
  const [timeRangeForm] = Form.useForm();
  const [timeRangeType, setTimeRangeType] = useState<TimeFrames>(
    filterToEdit?.defaultValue?.timeRangeType || TimeFrames.noTimeRange,
  );

  const initialValue = {
    timeRangeType:
      filterToEdit?.defaultValue?.timeRangeType || TimeFrames.noTimeRange,
    timeRange: filterToEdit?.defaultValue?.timeRange || TimeFrames.noTimeRange,
  };

  const setFieldValue = (timeRangeType: TimeFrames) => (timeRange: string) =>
    setFilterFieldValues(form, filterId, {
      defaultValue: {
        timeRange,
        timeRangeType,
      },
    });

  return (
    <>
      <Form.Item
        hidden
        name={['filters', filterId, 'defaultValue']}
        initialValue={initialValue}
      />
      <Form
        form={timeRangeForm}
        onValuesChange={() => {
          const values = timeRangeForm.getFieldsValue();
          const defaultValue: TimeRangeValue = {
            timeRangeType: values.timeRangeType,
          };
          if (values.timeRangeType === TimeFrames.relativeToToday) {
            defaultValue.timeRange = `${values.timeRelation} ${values.timePeriod} ${values.timeGrains}`;
          } else if (values.timeRangeType === TimeFrames.startEnd) {
            defaultValue.timeRange = values.startEnd;
          } else {
            defaultValue.timeRange = values.timeRangeType;
          }

          setFilterFieldValues(form, filterId, {
            defaultValue,
          });
        }}
      >
        <Form.Item
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
          <StartEnd
            filterToEdit={filterToEdit}
            setFieldValue={setFieldValue(TimeFrames.startEnd)}
          />
        )}
        {timeRangeType === TimeFrames.relativeToToday && (
          <RelativeToToday
            filterToEdit={filterToEdit}
            setFieldValue={setFieldValue(TimeFrames.relativeToToday)}
          />
        )}
      </Form>
    </>
  );
};

export default TimeRangeFilter;
