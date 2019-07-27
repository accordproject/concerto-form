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

import React, { Component } from 'react';
import ReactFormVisitor from './reactformvisitor';
import './concertoForm.css';
import PropTypes from 'prop-types';
import jsonpath from 'jsonpath';
import { FormGenerator } from '@accordproject/concerto-ui-core';
import isEqual from 'lodash.isequal';

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onFieldValueChange = this.onFieldValueChange.bind(this);

    this.state = {
      // A mutable copy of this.props.json
      // This is needed so that we can use the jsonpath library to change object properties by key
      // using the jsonpath module, without modifying the props object
      value: null,
    };

    // Default values which can be overridden by parent components
    this.options = Object.assign({
      includeOptionalFields: true,
      includeSampleData: 'sample',
      disabled: props.readOnly,
      visitor: new ReactFormVisitor(),
      // CSS Styling, specify classnames
      customClasses : {
        field: 'ui field',
        declaration: 'ui field',
        declarationHeader: 'ui dividing header',
        enumeration: 'ui fluid dropdown',
        required: 'ui required',
        boolean: 'ui toggle checkbox',
        button: 'ui fluid button'
      },
      onFieldValueChange: (e, key) => {
        this.onFieldValueChange(e, key);
      },
      addElement: (e, key, field) => {
        this.addElement(e, key, field);
      },
      removeElement: (e, key, index) => {
        this.removeElement(e, key, index);
      },
    }, props.options);

    this.generator = new FormGenerator(this.options);
  }

  componentDidMount() {
    this._loadAsyncData().then((modelProps) => {
      this.props.onModelChange(modelProps);
    });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.models,prevProps.models)) {
      this._loadAsyncData().then((modelProps) => {
        this.props.onModelChange(modelProps);
      });
    }
  }

  async loadModelFiles(files, type) {
    let types;
    let json;
    let fqn = this.props.type;
    try {
      types = await this.generator.loadFromText(files);
    // The model file was invalid
    } catch (error){
      // Set default values to avoid trying to render a bad model
      // Don't change the JSON, it might be valid once the model file is fixed
      return { types: [] };
    }

    if(types.length === 0){
      return { types: [] };
    }

    if(!types.map(t => t.getFullyQualifiedName()).includes(this.props.type)){
      fqn = types[0].getFullyQualifiedName();
      json = this.generateJSON(fqn);
      return { types, json, fqn };
    }
    json = this.generateJSON(this.props.type);
    return { types, json };
  }

  _loadAsyncData() {
    return this.loadModelFiles(this.props.models, 'text');
  }

  static getDerivedStateFromProps(props, state){
    return { value: props.json, warning: null};
  }

  removeElement(e, key, index){
    const array = jsonpath.value(this.state.value, key);
    array.splice(index, 1);
    this.props.onValueChange(this.state.value);
  }

  addElement(e, key, value){
    const array = jsonpath.value(this.state.value, key);
    jsonpath.value(this.state.value,`${key}.${array.length}`, value);
    this.props.onValueChange(this.state.value);
  }

  isInstanceOf(model, type){
    return this.generator.isInstanceOf(model, type);
  }

  generateJSON(type){
    // The type changed so we have to generate a new instance
    if(this.props.json && !this.isInstanceOf(this.props.json, type)) {
      return this.generator.generateJSON(type);
    // The instance is null so we have to create a new instance
    } else if(!this.props.json) {
      return this.generator.generateJSON(type);
    }
    // Otherwise, just use what we already have
    return this.props.json;
  }

  onFieldValueChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    jsonpath.value(this.state.value, key, value);
    this.props.onValueChange(this.state.value);
  }

  renderForm(){
    if (this.props.type && this.state.value) {
      return this.generator.generateHTML(this.props.type, this.state.value);
    }
    return null;
  }

  render() {
    return (
        <form className="ui form" style={this.props.style}>
          {this.renderForm()}
        </form>
    );
  }
}

ConcertoForm.propTypes = {
  models: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  json: PropTypes.object,
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
  style: PropTypes.object,
};

export default ConcertoForm;
