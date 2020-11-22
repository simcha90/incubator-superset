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
import { Tree, Form, FormInstance } from 'src/common/components';
import { useFilterScopeTree } from './state';
import { DASHBOARD_ROOT_ID } from '../../util/constants';
import { findFilterScope } from './utils';
import { Filter } from './types';

type ScopingTreeProps = {
  form: FormInstance;
  filterToEdit?: Filter;
};

const ScopingTree: FC<ScopingTreeProps> = ({ form, filterToEdit }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([
    DASHBOARD_ROOT_ID,
  ]);

  const { treeData, layout } = useFilterScopeTree();

  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  const handleExpand = (expandedKeys: string[]) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const handleCheck = (checkedKeys: string[]) => {
    setCheckedKeys(checkedKeys);
    form.setFieldsValue({ scope: findFilterScope(checkedKeys, layout) });
  };

  const initialValue = filterToEdit?.scope || {
    rootPath: [DASHBOARD_ROOT_ID],
    excluded: [],
  };

  return (
    <>
      <Form.Item name="scope" hidden initialValue={initialValue} />
      <Tree
        checkable
        selectable={false}
        onExpand={handleExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={handleCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </>
  );
};

export default ScopingTree;
