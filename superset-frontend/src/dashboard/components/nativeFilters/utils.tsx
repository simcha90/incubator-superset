import { t } from '@superset-ui/core';
import { FilterType } from './types';

export const FilterTypeNames = {
  [FilterType.text]: t('Text'),
  [FilterType.timeRange]: t('Time Range'),
};
