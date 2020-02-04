"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactformvisitor = _interopRequireDefault(require("./reactformvisitor"));

require("./concertoForm.css");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _jsonpath = _interopRequireDefault(require("jsonpath"));

var _concertoUiCore = require("@accordproject/concerto-ui-core");

var _lodash = _interopRequireDefault(require("lodash.isequal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoForm extends _react.Component {
  constructor(props) {
    super(props);
    this.onFieldValueChange = this.onFieldValueChange.bind(this);
    this.state = {
      // A mutable copy of this.props.json
      // This is needed so that we can use the jsonpath library to change object properties by key
      // using the jsonpath module, without modifying the props object
      value: null
    }; // Default values which can be overridden by parent components

    this.options = Object.assign({
      includeOptionalFields: true,
      includeSampleData: 'sample',
      disabled: props.readOnly,
      visitor: new _reactformvisitor.default(),
      // CSS Styling, specify classnames
      customClasses: {
        field: 'ui field',
        declaration: 'ui field',
        declarationHeader: 'ui dividing header',
        enumeration: 'ui fluid dropdown',
        required: 'ui required',
        boolean: 'ui toggle checkbox',
        button: 'ui fluid button basic fullHeight',
        arrayElement: 'arrayElement',
        classElement: 'classElement'
      },
      onFieldValueChange: (e, key) => {
        this.onFieldValueChange(e, key);
      },
      addElement: (e, key, field) => {
        this.addElement(e, key, field);
      },
      removeElement: (e, key, index) => {
        this.removeElement(e, key, index);
      }
    }, props.options);
    this.generator = new _concertoUiCore.FormGenerator(this.options);
  }

  componentDidMount() {
    this._loadAsyncData().then(modelProps => {
      this.props.onModelChange(modelProps);
    });
  }

  componentDidUpdate(prevProps) {
    if (!(0, _lodash.default)(this.props.models, prevProps.models)) {
      this._loadAsyncData().then(modelProps => {
        this.props.onModelChange(modelProps);
      });
    }
  }

  async loadModelFiles(files, type) {
    let types;
    let json;
    let fqn = this.props.type;

    try {
      types = await this.generator.loadFromText(files); // The model file was invalid
    } catch (error) {
      console.error(error.message); // Set default values to avoid trying to render a bad model
      // Don't change the JSON, it might be valid once the model file is fixed

      return {
        types: []
      };
    }

    if (types.length === 0) {
      return {
        types: []
      };
    }

    try {
      if (!types.map(t => t.getFullyQualifiedName()).includes(this.props.type)) {
        fqn = types[0].getFullyQualifiedName();
        json = this.generateJSON(fqn);
        return {
          types,
          json,
          fqn
        };
      }

      json = this.generateJSON(this.props.type);
    } catch (err) {
      console.log(err);
    }

    return {
      types,
      json
    };
  }

  _loadAsyncData() {
    return this.loadModelFiles(this.props.models, 'text');
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.json,
      warning: null
    };
  }

  removeElement(e, key, index) {
    const array = _jsonpath.default.value(this.state.value, key);

    array.splice(index, 1);
    this.props.onValueChange(this.state.value);
  }

  addElement(e, key, value) {
    const array = _jsonpath.default.value(this.state.value, key);

    _jsonpath.default.value(this.state.value, `${key}.${array.length}`, value);

    this.props.onValueChange(this.state.value);
  }

  isInstanceOf(model, type) {
    return this.generator.isInstanceOf(model, type);
  }

  generateJSON(type) {
    try {
      // The type changed so we have to generate a new instance
      if (this.props.json && !this.isInstanceOf(this.props.json, type)) {
        return this.generator.generateJSON(type); // The instance is null so we have to create a new instance
      } else if (!this.props.json) {
        return this.generator.generateJSON(type);
      }
    } catch (err) {
      console.log(err);
    } // Otherwise, just use what we already have


    return this.props.json;
  }

  onFieldValueChange(e, key) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    _jsonpath.default.value(this.state.value, key, value);

    this.props.onValueChange(this.state.value);
  }

  renderForm() {
    if (this.props.type && this.state.value) {
      try {
        return this.generator.generateHTML(this.props.type, this.state.value);
      } catch (err) {
        console.error(err);
        return null;
      }
    }

    return null;
  }

  render() {
    return _react.default.createElement("form", {
      className: "ui form",
      style: this.props.style
    }, this.renderForm());
  }

}

ConcertoForm.propTypes = {
  models: _propTypes.default.arrayOf(_propTypes.default.string),
  type: _propTypes.default.string,
  json: _propTypes.default.object,
  onModelChange: _propTypes.default.func.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  options: _propTypes.default.object,
  readOnly: _propTypes.default.bool,
  style: _propTypes.default.object
};
var _default = ConcertoForm;
exports.default = _default;