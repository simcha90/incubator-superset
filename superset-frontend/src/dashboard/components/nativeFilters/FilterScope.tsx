import React, { FC, useState } from 'react';
import { t } from '@superset-ui/core';
import {
  Form,
  Radio,
  Typography,
  Space,
  FormInstance,
} from '../../../common/components';
import { Filter, NativeFiltersForm, Scoping } from './types';
import ScopingTree from './ScopingTree';
import { DASHBOARD_ROOT_ID } from '../../util/constants';

type FilterScopeProps = {
  filterId: string;
  filterToEdit?: Filter;
  form: FormInstance<NativeFiltersForm>;
};

const defaultScopeValue = {
  rootPath: [DASHBOARD_ROOT_ID],
  excluded: [],
};

const FilterScope: FC<FilterScopeProps> = ({
  filterId,
  filterToEdit,
  form,
}) => {
  const [advancedScopingOpen, setAdvancedScopingOpen] = useState<Scoping>(
    Scoping.all,
  );

  const { scope = defaultScopeValue } = filterToEdit || {};

  const groupingInitialValue =
    scope &&
    scope.rootPath === defaultScopeValue.rootPath &&
    scope.excluded === defaultScopeValue.excluded
      ? Scoping.all
      : Scoping.specific;

  return (
    <Space direction="vertical">
      <Form.Item
        name={['filters', filterId, 'scope']}
        hidden
        initialValue={scope}
      />
      <Radio.Group
        defaultValue={groupingInitialValue}
        onChange={({ target: { value } }) => {
          setAdvancedScopingOpen(value as Scoping);
        }}
      >
        <Radio value={Scoping.all}>{t('Apply to all panels')}</Radio>
        <Radio value={Scoping.specific}>{t('Apply to specific panels')}</Radio>
      </Radio.Group>
      <Typography.Text type="secondary">
        {advancedScopingOpen === Scoping.specific
          ? t('Only selected panels will be affected by this filter')
          : t('All panels with this column will be affected by this filter')}
      </Typography.Text>
      {advancedScopingOpen === Scoping.specific && (
        <ScopingTree
          form={form}
          filterToEdit={filterToEdit}
          filterId={filterId}
        />
      )}
    </Space>
  );
};

export default FilterScope;
