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
import { Utilities } from '@accordproject/concerto-ui-core';
import { Checkbox, Input, Form, Button, Select } from 'semantic-ui-react';
import { parseValue } from '../utilities';

export const ConcertoLabel = ({ skip, name }) => !skip ? <label>{Utilities.normalizeLabel(name)}</label> : null;

export const ConcertoCheckbox = ({
  id, field, readOnly, required, value, onFieldValueChange, skipLabel
}) => 
 <Form.Field required={required}>
   <ConcertoLabel skip={skipLabel} name={field.getName()} />
   <Checkbox 
      toggle
      readOnly={readOnly}
      checked={value}
      onChange={(e, data) => onFieldValueChange(data, key)}
      key={id} />
  </Form.Field >;

export const ConcertoInput = ({
  id, field, readOnly, required, value, onFieldValueChange, skipLabel, type
}) => 
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <Input 
      type={type}
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange({ ...data, value: parseValue(data.value, field.getType()) }, id)}
      key={id} />
  </Form.Field>;
  
export const ConcertoDateTime = ({
  id, field, readOnly, required, value, onFieldValueChange, skipLabel, type
}) => 
  <Form.Field required={required}>
    <ConcertoLabel skip={skipLabel} name={field.getName()} />
    <Input 
      type={type}
      disabled={readOnly}
      value={new Date(value).toISOString().slice(0,19)}
      onChange={(e, data) => onFieldValueChange(data, id)}
      key={id} />
  </Form.Field>;

export const ConcertoArray = ({
  id, field, readOnly, required, children, addElement
}) => 
  <Form.Field required={required}>
    <ConcertoLabel name={field.getName()} />
    { children }
    <div className='arrayElement grid'>
      <div/>
      <div>                          
        <Button
          positive
          basic
          icon='plus'
          disabled={readOnly}
          onClick={(e)=>{ addElement(e, id); e.preventDefault(); }}/>
      </div>
    </div>
  </Form.Field>;

export const ConcertoArrayElement = ({
  id, readOnly, children, index, removeElement
}) => 
  <div className='arrayElement grid'>
    <div>{ children }</div>
    <div>                          
      <Button
        negative  
        basic
        icon='times'
        disabled={readOnly}
        onClick={(e)=>{ removeElement(e, id, index); e.preventDefault(); }} />
    </div>
  </div>;

export const ConcertoDropdown = ({
  id, field, readOnly, value, onFieldValueChange, options
}) => 
  <Form.Field required key={field.getName().toLowerCase()}>
    <Select 
      fluid
      readOnly={readOnly}
      value={value}
      onChange={(e, data) => onFieldValueChange(data, id)}
      key={id}
      options={options}
    />
  </Form.Field>;

const BinaryField = ({ className, children }) => <div className={className}>
  <div>{ children[0] }</div>
  <div>{ children[1] }</div>
</div>

export const MonetaryAmount = ({ children, name }) => 
  <BinaryField className='monetaryAmount'>{children}</BinaryField>;

export const Duration = ({ children, name }) => 
  <BinaryField className='duration'>{children}</BinaryField>;