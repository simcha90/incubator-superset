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
import {
  Form,
  InputNumber,
  Select,
  Space,
  FormInstance,
} from 'src/common/components';
import 'react-datetime/css/react-datetime.css';
import { t } from '@superset-ui/core';
import { AntCallback, Filter } from '../../types';
import StartEnd from './StartEnd';
import {
  TimeFrameNames,
  TimeFrames,
  TimeGrainNames,
  TimeGrains,
  TimeRelationNames,
  TimeRelations,
  TimeRelationsMap,
} from './types';

type TimeRangeFilterProps = {
  filterToEdit?: Filter;
  form: FormInstance;
};

type TimeRangeValue = {
  timeRangeType: TimeFrames;
  timeRange?: string;
};

const TimeRangeFilter: FC<TimeRangeFilterProps> = ({ form, filterToEdit }) => {
  const [timeRangeForm] = Form.useForm();
  const [timeRangeType, setTimeRangeType] = useState<TimeFrames>(
    filterToEdit?.defaultValue?.timeRangeType || TimeFrames.noTimeRange,
  );

  const initialValue = {
    timeRangeType:
      filterToEdit?.defaultValue?.timeRangeType || TimeFrames.noTimeRange,
    timeRange: filterToEdit?.defaultValue?.timeRange || TimeFrames.noTimeRange,
  };

  const [
    timeRelation = TimeRelations.last,
    timePeriod = 7,
    timeGrains = 'days',
  ] = filterToEdit?.defaultValue || '';

  return (
    <>
      <Form.Item
        hidden
        name="defaultValue"
        key="defaultValue"
        initialValue={initialValue}
      />
      <Form
        form={timeRangeForm}
        onValuesChange={changes => {
          const values = timeRangeForm.getFieldsValue();
          const defaultValue: TimeRangeValue = {
            timeRangeType: values.timeRangeType,
          };
          if (values.timeRangeType === TimeFrames.relativeToToday) {
            defaultValue.timeRange = `${values.timeRelation} ${values.timePeriod} ${values.timeGrain}`;
          } else if (values.timeRangeType === TimeFrames.startEnd) {
            defaultValue.timeRange = values.startEnd;
          } else {
            defaultValue.timeRange = values.timeRangeType;
          }

          form.setFieldsValue({
            defaultValue,
          });
        }}
      >
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
          <StartEnd
            setStartEnd={(value: string) =>
              timeRangeForm.setFieldsValue({ startEnd: value })
            }
          />
        )}
        {timeRangeType === TimeFrames.relativeToToday && (
          <Form.Item
            rules={[{ required: true }]}
            label={TimeFrameNames[TimeFrames.relativeToToday]}
          >
            <Space>
              <Form.Item
                name="timeRelation"
                initialValue={TimeRelationsMap[timeRelation]}
                rules={[{ required: true }]}
              >
                <Select>
                  {Object.values(TimeRelations).map(relation => (
                    <Select.Option value={relation} key={relation}>
                      {TimeRelationNames[relation]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="timePeriod"
                initialValue={timePeriod}
                rules={[{ required: true }]}
              >
                <InputNumber min={1} defaultValue={timePeriod} />
              </Form.Item>
              <Form.Item
                initialValue={timeGrains}
                rules={[{ required: true }]}
                name="timeGrains"
              >
                <Select>
                  {Object.values(TimeGrains).map(grain => (
                    <Select.Option value={grain} key={grain}>
                      {TimeGrainNames[grain]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default TimeRangeFilter;
