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

import { t } from '@superset-ui/core';

export enum TimeRelations {
  last = 'last',
  next = 'next',
}
export const TimeRelationsMap = Object.entries(TimeRelations).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
);

export const TimeRelationNames = {
  [TimeRelations.last]: t('Last'),
  [TimeRelations.next]: t('Next'),
};

export enum TimeFrames {
  'noTimeRange' = 'noTimeRange',
  'lastDay' = 'lastDay',
  'lastWeek' = 'lastWeek',
  'lastMonth' = 'lastMonth',
  'lastQuarter' = 'lastQuarter',
  'lastYear' = 'lastYear',
  'relativeToToday' = 'relativeToToday',
  'startEnd' = 'startEnd',
}

export const TimeFrameNames = {
  [TimeFrames.noTimeRange]: t('No Time Range'),
  [TimeFrames.lastDay]: t('Last day'),
  [TimeFrames.lastWeek]: t('Last week'),
  [TimeFrames.lastMonth]: t('Last month'),
  [TimeFrames.lastQuarter]: t('Last quarter'),
  [TimeFrames.lastYear]: t('Last year'),
  [TimeFrames.relativeToToday]: t('Relative to Today'),
  [TimeFrames.startEnd]: t('Start / End'),
};

export enum TimeGrains {
  'seconds' = 'seconds',
  'minutes' = 'minutes',
  'hours' = 'hours',
  'days' = 'days',
  'weeks' = 'weeks',
  'months' = 'months',
  'years' = 'years',
}

export const TimeGrainNames = {
  [TimeGrains.seconds]: t('seconds'),
  [TimeGrains.minutes]: t('minutes'),
  [TimeGrains.hours]: t('hours'),
  [TimeGrains.days]: t('days'),
  [TimeGrains.weeks]: t('weeks'),
  [TimeGrains.months]: t('months'),
  [TimeGrains.years]: t('years'),
};
