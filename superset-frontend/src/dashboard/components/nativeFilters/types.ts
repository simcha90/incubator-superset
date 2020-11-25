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
import { QueryObjectFilterClause } from '@superset-ui/core';

export enum Scoping {
  all,
  specific,
}

type DefaultValue = any | null;

export interface NativeFiltersFormItem {
  scope: Scope;
  name: string;
  dataset: {
    value: number;
    label: string;
  };
  column: string;
  isInstant: boolean;
  allowsMultipleValues: boolean;
  isRequired: boolean;
  type: FilterType;
  defaultValue: DefaultValue;
}

export interface NativeFiltersForm {
  filters: Record<string, NativeFiltersFormItem>;
}

export interface Column {
  name: string;
  displayName?: string;
}

export interface Scope {
  rootPath: string[];
  excluded: number[];
}

// Using to pass setState React callbacks directly to And components
export type AntCallback = (value1?: any, value2?: any) => void;

/** The target of a filter is the datasource/column being filtered */
export interface Target {
  datasetId: number;
  column: Column;

  // maybe someday support this?
  // show values from these columns in the filter options selector
  // clarityColumns?: Column[];
}

export enum FilterType {
  text = 'text',
  timeRange = 'timeRange',
}

/**
 * This is a filter configuration object, stored in the dashboard's json metadata.
 * The values here do not reflect the current state of the filter.
 */
export interface Filter {
  id: string; // randomly generated at filter creation
  name: string;
  type: FilterType;
  // for now there will only ever be one target
  // when multiple targets are supported, change this to Target[]
  targets: [Target];
  defaultValue: DefaultValue;
  scope: Scope;
  isInstant: boolean;
  allowsMultipleValues: boolean;
  isRequired: boolean;
}

export type FilterConfiguration = Filter[];

export type SelectedValues = string[] | null;

/** Current state of the filter, stored in `nativeFilters` in redux */
export type FilterState = {
  id: string; // ties this filter state to the config object
  optionsStatus: 'loading' | 'success' | 'fail';
  options: string[] | null;
  selectedValues?: SelectedValues;
  /**
   * If the config changes, the current options/values may no longer be valid.
   * isDirty indicates that state.
   */
  isDirty: boolean;
};

export type AllFilterState = {
  column: Column;
  datasetId: number;
  datasource: string;
  id: string;
  selectedValues: SelectedValues;
  filterClause?: QueryObjectFilterClause;
};

/** UI Ant tree type */
export type TreeItem = {
  children: TreeItem[];
  key: string;
  title: string;
};
