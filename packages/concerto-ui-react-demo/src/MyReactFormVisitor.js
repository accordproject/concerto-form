/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import get from 'lodash.get';
import toPath from 'lodash.topath';
import { ReactFormVisitor } from '@accordproject/concerto-ui-react';

/**
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @private
 * @class
 * @memberof module:composer-common
 */
class MyReactFormVisitor extends ReactFormVisitor {
  /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
  visitField(field, parameters) {
    if(field.getFullyQualifiedTypeName() === 'io.clause.demo.fragileGoods.ShipmentStatus'){
      parameters.stack.push(field.getName());

      const key = toPath(parameters.stack);
      const value = get(parameters.json,key);
      const style = parameters.customClasses.field;

      const handleChange = (e, { value })=>parameters.onFieldValueChange({ target: { value }}, key);

      const component = <div className={style} key={field.getName()}>
        <label>Status</label>
        <Form.Field>
          <Radio
            label='Created'
            name={`radioGroup_${field.getName()}`}
            value='CREATED'
            checked={value==='CREATED'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='In Transit'
            name={`radioGroup_${field.getName()}`}
            value='IN_TRANSIT'
            checked={value==='IN_TRANSIT'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label='Arrived'
            name={`radioGroup_${field.getName()}`}
            value='ARRIVED'
            checked={value==='ARRIVED'}
            onChange={handleChange}
          />
        </Form.Field>
      </div>;

      parameters.stack.pop();
      return component;
    }
    return super.visitField(field, parameters);
  }
}

export default MyReactFormVisitor;
