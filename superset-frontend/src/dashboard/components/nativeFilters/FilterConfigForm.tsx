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

import React, { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { styled, SupersetClient, t } from '@superset-ui/core';
import SupersetResourceSelect, {
  Value,
} from 'src/components/SupersetResourceSelect';
import {
  Checkbox,
  Form,
  Input,
  Select,
  Typography,
} from 'src/common/components';
import { usePrevious } from 'src/common/hooks/usePrevious';
import { AsyncSelect } from 'src/components/Select';
import { useToasts } from 'src/messageToasts/enhancers/withToasts';
import getClientErrorObject from 'src/utils/getClientErrorObject';
import { Filter, FilterType, NativeFiltersForm } from './types';
import { FilterTypeNames, setFilterFieldValues } from './utils';
import TextFilter from './filterTypes/TextFilter';
import TimeRangeFilter from './filterTypes/TimeRangeFilter/TimeRangeFilter';
import { TimeFrames } from './filterTypes/TimeRangeFilter/types';
import FilterScope from './FilterScope';

type DatasetSelectValue = {
  value: number;
  label: string;
};

type ColumnSelectValue = {
  value: string;
  label: string;
};

interface ColumnSelectProps {
  form: FormInstance<NativeFiltersForm>;
  filterId: string;
  datasetId?: number | null | undefined;
  value?: ColumnSelectValue | null;
  onChange?: (value: ColumnSelectValue | null) => void;
}

const datasetToSelectOption = (item: any): DatasetSelectValue => ({
  value: item.id,
  label: item.table_name,
});

/** Special purpose AsyncSelect that selects a column from a dataset */
function ColumnSelect({
  form,
  filterId,
  datasetId,
  value,
  onChange,
}: ColumnSelectProps) {
  const { addDangerToast } = useToasts();
  const lastDatasetId = usePrevious(datasetId);
  useEffect(() => {
    if (onChange && lastDatasetId && datasetId !== lastDatasetId) {
      form.setFields([
        { name: ['filters', filterId, 'column'], touched: false, value: null },
      ]);
    }
  }, [datasetId, lastDatasetId, form, filterId]);

  function loadOptions() {
    if (datasetId == null) return [];
    return SupersetClient.get({
      endpoint: `/api/v1/dataset/${datasetId}`,
    }).then(
      ({ json: { result } }) => {
        return result.columns.map((col: any) => col.column_name);
      },
      async badResponse => {
        const { error, message } = await getClientErrorObject(badResponse);
        let errorText = message || error || t('An error has occurred');
        if (message === 'Forbidden') {
          errorText = t('You do not have permission to edit this dashboard');
        }
        addDangerToast(errorText);
        return [];
      },
    );
  }

  return (
    <AsyncSelect
      // "key" prop makes react render a new instance of the select whenever the dataset changes
      key={datasetId == null ? '*no dataset*' : datasetId}
      isDisabled={datasetId == null}
      value={value}
      onChange={onChange}
      isMulti={false}
      loadOptions={loadOptions}
      defaultOptions // load options on render
      cacheOptions
    />
  );
}

const filterTypeElements = {
  [FilterType.text]: TextFilter,
  [FilterType.timeRange]: TimeRangeFilter,
};

const defaultValuesPerFilterType = {
  [FilterType.text]: '',
  [FilterType.timeRange]: {
    timeRangeType: TimeFrames.noTimeRange,
    timeRange: TimeFrames.noTimeRange,
  },
};

const RemovedContent = styled.div`
  display: flex;
  height: 400px; // arbitrary
  text-align: center;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.grayscale.base};
`;

export interface FilterConfigFormProps {
  filterId: string;
  filterToEdit?: Filter;
  removed?: boolean;
  form: FormInstance;
}

export const FilterConfigForm: React.FC<FilterConfigFormProps> = ({
  filterId,
  filterToEdit,
  removed,
  form,
}) => {
  const [filterType, setFilterType] = useState<FilterType>(
    filterToEdit?.type || FilterType.text,
  );
  const FilterTypeElement = filterTypeElements[filterType];
  const [dataset, setDataset] = useState<Value<number> | undefined>();

  if (removed) {
    return (
      <RemovedContent>
        {t(
          'You have removed this filter. Click the trash again to bring it back.',
        )}
      </RemovedContent>
    );
  }

  return (
    <>
      <Form.Item
        name={['filters', filterId, 'name']}
        label={t('Filter Name')}
        initialValue={filterToEdit?.name}
        rules={[{ required: !removed, message: t('Name is required') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['filters', filterId, 'dataset']}
        label={t('Datasource')}
        rules={[{ required: !removed, message: t('Datasource is required') }]}
      >
        <SupersetResourceSelect
          initialId={filterToEdit?.targets[0].datasetId}
          resource="dataset"
          searchColumn="table_name"
          transformItem={datasetToSelectOption}
          isMulti={false}
          onChange={setDataset}
        />
      </Form.Item>
      <Form.Item
        // don't show the column select unless we have a dataset
        // style={{ display: datasetId == null ? undefined : 'none' }}
        name={['filters', filterId, 'column']}
        initialValue={filterToEdit?.targets[0]?.column?.name}
        label={t('Field')}
        rules={[{ required: !removed, message: t('Field is required') }]}
      >
        <ColumnSelect
          form={form}
          filterId={filterId}
          datasetId={dataset?.value}
        />
      </Form.Item>
      <Form.Item
        name={['filters', filterId, 'isInstant']}
        initialValue={filterToEdit?.type || FilterType.text}
        label={t('Filter Type')}
        rules={[{ required: true }]}
      >
        <Select
          onChange={type => {
            setFilterType(type as FilterType);
            setFilterFieldValues(form, filterId, {
              defaultValue: defaultValuesPerFilterType[type as FilterType],
            });
          }}
        >
          {Object.values(FilterType).map(filterType => (
            <Select.Option value={filterType} key={filterType}>
              {FilterTypeNames[filterType]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <FilterTypeElement
        form={form}
        filterToEdit={filterToEdit}
        filterId={filterId}
      />
      <Form.Item
        name={['filters', filterId, 'isInstant']}
        label={t('Apply changes instantly')}
        initialValue={filterToEdit?.isInstant}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={['filters', filterId, 'allowsMultipleValues']}
        label={t('Allow multiple selections')}
        initialValue={filterToEdit?.allowsMultipleValues}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name={['filters', filterId, 'isRequired']}
        label={t('Required')}
        initialValue={filterToEdit?.isRequired}
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item
        name="searchAllFiltersOptions"
        label={t('Search All Filter Options')}
      >
        <Input type="checkbox" />
      </Form.Item>
      <Typography.Title level={5}>{t('Scoping')}</Typography.Title>
      <FilterScope
        filterId={filterId}
        filterToEdit={filterToEdit}
        form={form}
      />
    </>
  );
};

export default FilterConfigForm;
