"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _jsonpath = _interopRequireDefault(require("jsonpath"));

var _concertoUiCore = require("@accordproject/concerto-ui-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @private
 * @class
 * @memberof module:composer-common
 */
class ReactFormVisitor extends _concertoUiCore.HTMLFormVisitor {
  /**
   * Helper function to determine whether to hide a property from the rendering
   * @param {Property} property - the object being visited, either a field or a resource
   * @param {Object} parameters  - the parameter
   * @return {boolean} - true if the property should be hidden, false otherwise
   * @private
   */
  hideProperty(property, parameters) {
    if (parameters.hiddenFields.find(fqn => fqn === property.getFullyQualifiedName())) {
      parameters.stack.pop();
      return true;
    }

    return false;
  }
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitClassDeclaration(classDeclaration, parameters) {
    let component = null;

    if (parameters.hideIdentifiers) {
      if (!parameters.hiddenFields) {
        parameters.hiddenFields = [];
      }

      const idFieldName = classDeclaration.getIdentifierFieldName();

      if (idFieldName) {
        const idField = classDeclaration.getProperty(idFieldName);
        parameters.hiddenFields.push(idField.getFullyQualifiedName());
      }
    }

    if (!classDeclaration.isSystemType() && !classDeclaration.isAbstract()) {
      const id = classDeclaration.getName().toLowerCase();

      const renderClassDeclaration = (classDeclaration, parameters) => {
        if (['org.accordproject.money.MonetaryAmount', 'org.accordproject.money.DigitalMonetaryAmount'].includes(classDeclaration.getFullyQualifiedName())) {
          return _react.default.createElement("div", {
            key: id,
            name: classDeclaration.getName()
          }, this.visitMonetaryAmount(classDeclaration, parameters));
        } else if (['org.accordproject.time.Duration', 'org.accordproject.time.Period'].includes(classDeclaration.getFullyQualifiedName())) {
          return _react.default.createElement("div", {
            key: id,
            name: classDeclaration.getName()
          }, this.visitDuration(classDeclaration, parameters));
        }

        return _react.default.createElement("div", {
          key: id,
          name: classDeclaration.getName(),
          className: parameters.customClasses.classElement
        }, classDeclaration.getProperties().map(property => {
          return property.accept(this, parameters);
        }));
      }; // Is this class in an array or not?


      if (parameters.stack.length === 0) {
        component = _react.default.createElement("div", {
          key: id
        }, _react.default.createElement("div", {
          name: classDeclaration.getName()
        }, renderClassDeclaration(classDeclaration, parameters)));
      } else {
        component = renderClassDeclaration(classDeclaration, parameters);
      }
    }

    return component;
  }

  visitMonetaryAmount(amountDeclaration, parameters) {
    const props = amountDeclaration.getProperties();
    parameters.skipLabel = true;

    const component = _react.default.createElement("div", {
      className: "monetaryAmount"
    }, _react.default.createElement("div", null, props[0].accept(this, parameters)), _react.default.createElement("div", null, props[1].accept(this, parameters)));

    parameters.skipLabel = false;
    return component;
  }

  visitDuration(amountDeclaration, parameters) {
    const props = amountDeclaration.getProperties();
    parameters.skipLabel = true;

    const component = _react.default.createElement("div", {
      className: "duration"
    }, _react.default.createElement("div", null, props[0].accept(this, parameters)), _react.default.createElement("div", null, props[1].accept(this, parameters)));

    parameters.skipLabel = false;
    return component;
  }
  /**
   * Visitor design pattern
   * @param {EnumDeclaration} enumDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitEnumDeclaration(enumDeclaration, parameters) {
    let component = null;

    const key = _jsonpath.default.stringify(parameters.stack);

    const value = _jsonpath.default.value(parameters.json, key);

    const styles = parameters.customClasses;
    const id = enumDeclaration.getName().toLowerCase();
    component = _react.default.createElement("div", {
      className: styles.field,
      key: id
    }, _react.default.createElement("select", {
      className: styles.enumeration,
      value: value,
      onChange: e => parameters.onFieldValueChange(e, key),
      key: key
    }, enumDeclaration.getProperties().map(property => {
      return property.accept(this, parameters);
    })));
    return component;
  }
  /**
   * Visitor design pattern
   * @param {Field} field - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitField(field, parameters) {
    parameters.stack.push(field.getName());

    if (this.hideProperty(field, parameters)) {
      return null;
    }

    ;

    let key = _jsonpath.default.stringify(parameters.stack);

    let value = _jsonpath.default.value(parameters.json, key);

    let component = null;
    const styles = parameters.customClasses;
    let style = styles.field;

    if (!field.isOptional()) {
      style += ' ' + styles.required;
    }

    if (parameters.disabled) {
      style += ' readonly transparent';
    }

    if (field.isArray()) {
      let arrayField = (field, parameters) => {
        let key = _jsonpath.default.stringify(parameters.stack);

        let value = _jsonpath.default.value(parameters.json, key);

        if (field.isPrimitive()) {
          if (field.getType() === 'Boolean') {
            return _react.default.createElement("div", {
              className: styles,
              key: field.getName() + '_wrapper'
            }, _react.default.createElement("div", {
              className: styles.boolean
            }, _react.default.createElement("input", {
              type: "checkbox",
              checked: value,
              value: value,
              onChange: e => parameters.onFieldValueChange(e, key),
              key: key
            }), _react.default.createElement("label", null)));
          } else if (this.toFieldType(field.getType()) === 'datetime-local') {
            return _react.default.createElement("div", {
              className: style,
              key: field.getName() + '_wrapper'
            }, _react.default.createElement("input", {
              type: this.toFieldType(field.getType()),
              className: styles.input,
              value: new Date(value).toDatetimeLocal(),
              onChange: e => parameters.onFieldValueChange(e, key),
              key: key
            }));
          } else {
            return _react.default.createElement("div", {
              className: style,
              key: field.getName() + '_wrapper'
            }, _react.default.createElement("input", {
              type: this.toFieldType(field.getType()),
              className: styles.input,
              value: value,
              onChange: e => parameters.onFieldValueChange(e, key),
              key: key
            }));
          }
        } else {
          let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
          type = this.findConcreteSubclass(type);
          return type.accept(this, parameters);
        }
      };

      let defaultValue = null;

      if (field.isPrimitive()) {
        defaultValue = this.convertToJSON(field);
      } else {
        let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
        type = this.findConcreteSubclass(type);

        if (type.isConcept()) {
          const concept = parameters.modelManager.getFactory().newConcept(type.getNamespace(), type.getName(), {
            includeOptionalFields: true,
            generate: 'sample'
          });
          defaultValue = parameters.modelManager.getSerializer().toJSON(concept);
        } else {
          const resource = parameters.modelManager.getFactory().newResource(type.getNamespace(), type.getName(), 'resource1', {
            includeOptionalFields: true,
            generate: 'sample'
          });
          defaultValue = parameters.modelManager.getSerializer().toJSON(resource);
        }
      }

      component = _react.default.createElement("div", {
        className: style,
        key: field.getName() + '_wrapper'
      }, !parameters.skipLabel && _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(field.getName())), value.map((element, index) => {
        parameters.stack.push(index);

        const arrayComponent = _react.default.createElement("div", {
          className: styles.arrayElement + ' grid',
          key: field.getName() + '_wrapper[' + index + ']'
        }, _react.default.createElement("div", null, arrayField(field, parameters)), _react.default.createElement("div", null, _react.default.createElement("button", {
          className: styles.button + ' negative icon',
          onClick: e => {
            parameters.removeElement(e, key, index);
            e.preventDefault();
          }
        }, _react.default.createElement("i", {
          className: "times icon"
        }))));

        parameters.stack.pop();
        return arrayComponent;
      }), _react.default.createElement("div", {
        className: styles.arrayElement + ' grid'
      }, _react.default.createElement("div", null), _react.default.createElement("div", null, _react.default.createElement("button", {
        className: styles.button + ' positive icon',
        onClick: e => {
          parameters.addElement(e, key, defaultValue);
          e.preventDefault();
        }
      }, _react.default.createElement("i", {
        className: "plus icon"
      })))));
    } else if (field.isPrimitive()) {
      if (field.getType() === 'Boolean') {
        component = _react.default.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, !parameters.skipLabel && _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(field.getName())), _react.default.createElement("div", {
          className: styles.boolean
        }, _react.default.createElement("input", {
          type: "checkbox",
          checked: value,
          value: value,
          onChange: e => parameters.onFieldValueChange(e, key),
          key: key
        }), _react.default.createElement("label", null)));
      } else if (this.toFieldType(field.getType()) === 'datetime-local') {
        component = _react.default.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, !parameters.skipLabel && _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(field.getName())), _react.default.createElement("input", {
          type: this.toFieldType(field.getType()),
          className: styles.input,
          value: new Date(value).toDatetimeLocal(),
          onChange: e => parameters.onFieldValueChange(e, key),
          key: key
        }));
      } else {
        component = _react.default.createElement("div", {
          className: style,
          key: field.getName() + '_wrapper'
        }, !parameters.skipLabel && _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(field.getName())), _react.default.createElement("input", {
          type: this.toFieldType(field.getType()),
          className: styles.input,
          value: value,
          onChange: e => parameters.onFieldValueChange(e, key),
          key: key
        }));
      }
    } else {
      let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
      type = this.findConcreteSubclass(type);
      component = _react.default.createElement("div", {
        className: style,
        key: field.getName()
      }, !parameters.skipLabel && _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(field.getName())), type.accept(this, parameters));
    }

    parameters.stack.pop();
    return component;
  }
  /**
   * Visitor design pattern
   * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitEnumValueDeclaration(enumValueDeclaration, parameters) {
    return _react.default.createElement("option", {
      key: enumValueDeclaration.getName(),
      value: enumValueDeclaration.getName()
    }, enumValueDeclaration.getName());
  }
  /**
   * Visitor design pattern
   * @param {Relationship} relationship - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */


  visitRelationship(relationship, parameters) {
    parameters.stack.push(relationship.getName());

    if (this.hideProperty(relationship, parameters)) {
      return null;
    }

    ;
    const styles = parameters.customClasses;
    let fieldStyle = styles.field;

    if (!relationship.isOptional()) {
      fieldStyle += ' ' + styles.required;
    }

    if (parameters.disabled) {
      fieldStyle += ' readonly transparent';
    }

    const key = _jsonpath.default.stringify(parameters.stack);

    let value = _jsonpath.default.value(parameters.json, key);

    let component;

    if (typeof value === 'object') {
      let type = parameters.modelManager.getType(value.$class);
      type = this.findConcreteSubclass(type);
      component = _react.default.createElement("div", {
        className: fieldStyle,
        key: relationship.getName()
      }, _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(relationship.getName())), type.accept(this, parameters));
    } else {
      component = _react.default.createElement("div", {
        className: fieldStyle,
        key: relationship.getName()
      }, _react.default.createElement("label", null, _concertoUiCore.Utilities.normalizeLabel(relationship.getName())), _react.default.createElement("input", {
        type: "text",
        className: styles.input,
        value: value,
        onChange: e => parameters.onFieldValueChange(e, key),
        key: key
      }));
    }

    parameters.stack.pop();
    return component;
  }
  /**
   * Find a concrete type that extends the provided type. If the supplied type argument is
   * not abstract then it will be returned.
   * TODO: work out whether this has to be a leaf node or whether the closest type can be used
   * It depends really since the closest type will satisfy the model but whether it satisfies
   * any transaction code which attempts to use the generated resource is another matter.
   * @param {ClassDeclaration} declaration the class declaration.
   * @return {ClassDeclaration} the closest extending concrete class definition.
   * @throws {Error} if no concrete subclasses exist.
   */


  findConcreteSubclass(declaration) {
    if (!declaration.isAbstract()) {
      return declaration;
    }

    const concreteSubclasses = declaration.getAssignableClassDeclarations().filter(subclass => !subclass.isAbstract()).filter(subclass => !subclass.isSystemType());

    if (concreteSubclasses.length === 0) {
      throw new Error('No concrete subclasses found');
    }

    return concreteSubclasses[0];
  }
  /**
   * Converts to JSON safe format.
   *
   * @param {Field} field - the field declaration of the object
   * @return {Object} the text JSON safe representation
   */


  convertToJSON(field) {
    switch (field.getType()) {
      case 'DateTime':
        {
          return new Date().toISOString();
        }

      case 'Integer':
        return 0;

      case 'Long':
      case 'Double':
        return 0.0;

      case 'Boolean':
        return false;

      default:
        return '';
    }
  }

}

Date.prototype.toDatetimeLocal = function toDatetimeLocal() {
  let date = this,
      ten = function (i) {
    return (i < 10 ? '0' : '') + i;
  },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds());

  return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II + ':' + SS;
};

var _default = ReactFormVisitor;
exports.default = _default;