/* eslint-disable require-jsdoc */
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

import React, { Component, Message } from 'react';
import './App.css';
import { ConcertoForm } from '@accordproject/concerto-ui-react';
import { Grid, Segment, Form, Dropdown, FormDropdown } from 'semantic-ui-react';
import TextareaAutosize from 'react-textarea-autosize';

class App extends Component {

  constructor(props){
    super(props);

    this.form = React.createRef();

    this.state = {
      // The Fully Qualified Name of the type that the form generates
      fqn: '',

      // The list of types in the model manager that can have a form generated
      types: [],

      // Source model file text
      model: `namespace io.clause.demo.fragileGoods

      import org.accordproject.cicero.contract.* from https://models.accordproject.org/cicero/contract.cto
      import org.accordproject.cicero.runtime.* from https://models.accordproject.org/cicero/runtime.cto
      import org.accordproject.time.Duration from https://models.accordproject.org/v2.0/time.cto
      import org.accordproject.money.MonetaryAmount from https://models.accordproject.org/money.cto
      
      /**
       * The status of a shipment
       */
      enum ShipmentStatus {
        o CREATED
        o IN_TRANSIT
        o ARRIVED
      }
      
      transaction DeliveryUpdate extends Request {
        o DateTime startTime
        o DateTime finishTime optional
        o ShipmentStatus status
        o Double[] accelerometerReadings
      }
      
      transaction PayOut extends Response {
        o MonetaryAmount amount
      }
      
      /**
       * The template model
       */
      asset FragileGoodsClause extends AccordContract {
        o AccordParty buyer
        o AccordParty seller
        o MonetaryAmount deliveryPrice
        o Double accelerationMin
        o Double accelerationMax
        o MonetaryAmount accelerationBreachPenalty
        o Duration deliveryLimitDuration
        o MonetaryAmount lateDeliveryPenalty
      }`,

      // Rendering options
      options: {
        includeOptionalFields: true,

        // The default values for a generated form if a JSON serialization isn't provided
        // 'sample' uses random well-typed values
        // 'empty' provides sensible empty values
        includeSampleData: 'sample', // or 'empty'

        updateExternalModels: true,
        // hideIdentifiers: true,
        hiddenFields: [
          'org.accordproject.base.Transaction.transactionId',
          'org.accordproject.cicero.contract.AccordContract.contractId',
          'org.accordproject.cicero.contract.AccordClause.clauseId',
          'org.accordproject.cicero.contract.AccordContractState.stateId',
          // property => property.getName() === 'parties'
        ],
      },

      error: null,
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onModelChange = this.onModelChange.bind(this);
  }

  handleDeclarationSelectionChange(e, { value }) {
    const state = {fqn: value};
    state.json = this.getForm().generateJSON(state.fqn);
    this.setState(state);
  }

  handleJsonTextAreaChange(event) {
    try {
      this.setState({json: JSON.parse(event.target.value)});
    }
    catch(err) {
      // invalid JSON
    }
  }

  handleModelTextAreaChange(event) {
    this.setState({model: event.target.value});
  }

  getForm(){
    return this.form.current.getForm();
  }

  onModelChange(modelProps){
    this.setState(modelProps);
  }

  onValueChange(json){
    this.setState({ json });
  }

  render() {
    const form = this.state.warning
      ? (<Message>
        <p>An error occured</p>
        <pre>{this.state.warning}</pre>
      </Message>)
      : <ConcertoForm
        ref={this.form}
        onModelChange={this.onModelChange}
        onValueChange={this.onValueChange}
        type={this.state.fqn}
        models={[this.state.model]}
        json={this.state.json}
        options={this.state.options}
      />;

    return (
      <div className="App">
        <h2>Concerto Form Generator - Demo Client</h2>
        <p>This tool demonstrates the <em>concerto-ui</em> library to generate a form from an Accord Project Concerto model.</p>
        <p>This demo produces a ReactJS form that is styled with Semantic UI.</p>
        <Grid columns={2} divided>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment>
                <Form>
                  <Form.Field>
                    <label>Model</label>
                    <TextareaAutosize
                      style={{ whiteSpace: 'pre' }}
                      value={this.state.model}
                      onChange={this.handleModelTextAreaChange.bind(this)}/>
                  </Form.Field>
                </Form>
              </Segment>
              <Segment>
                <Form>
                  <Form.Field>
                    <label>JSON</label>
                    <TextareaAutosize
                      style={{ whiteSpace: 'pre' }}
                      value={JSON.stringify(this.state.json, null, 2)}
                      onChange={this.handleJsonTextAreaChange.bind(this)}/>
                  </Form.Field>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <p>Choose a type from this dropdown to generate a form</p>
              <Form.Field>
                <label>Declaration Selection</label>
                <Dropdown
                  fluid
                  selection
                  onChange={this.handleDeclarationSelectionChange.bind(this)}
                  value={this.state.fqn}
                  options={this.state.types.map((type)=>{
                    const fqn = type.getFullyQualifiedName();
                    return { key: fqn, text: fqn, value: fqn };
                  })}/>
              </Form.Field>
              <Segment>
                <h2>Form</h2>
                {form}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
