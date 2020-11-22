import React, { FC, useEffect } from 'react';
import {
  TimeGrainNames,
  TimeGrains,
  TimeGrainsMap,
  TimeRelationNames,
  TimeRelations,
  TimeRelationsMap,
} from './types';
import {
  Form,
  InputNumber,
  Select,
  Space,
} from '../../../../../common/components';
import { Filter } from '../../types';

type RelativeToTodayProps = {
  filterToEdit?: Filter;
  setFieldValue: Function;
};

const RelativeToToday: FC<RelativeToTodayProps> = ({
  filterToEdit,
  setFieldValue,
}) => {
  const values = filterToEdit?.defaultValue?.split(' ') || [];
  const timeRelation = values[0] || TimeRelations.last;
  const timePeriod = values[1] || 7;
  const timeGrains = values[2] || TimeGrains.days;

  useEffect(() => {
    setFieldValue(`${timeRelation} ${timePeriod} ${timeGrains}`);
  }, [setFieldValue, timeGrains, timePeriod, timeRelation]);

  return (
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
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        initialValue={TimeGrainsMap[timeGrains]}
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
  );
};

export default RelativeToToday;
