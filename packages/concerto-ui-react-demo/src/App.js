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
import { Tab } from 'semantic-ui-react';

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
      model: `namespace concerto

import org.accordproject.money.MonetaryAmount from https://models.accordproject.org/money@0.2.0.cto
import org.accordproject.time.Duration from https://models.accordproject.org/time@0.2.0.cto
import org.accordproject.time.Period from https://models.accordproject.org/time@0.2.0.cto
  
transaction MyTxn {
  o String name optional
}

concept A {
  o String aId
  o String[] strings 
  o B[] bs
  o MonetaryAmount[] monies
  o MonetaryAmount money
  o Duration duration
  o Period period
}

concept B {
  o String string
  o Double number
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
        ]
      },

      error: null,
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onModelChange = this.onModelChange.bind(this);
  }

  handleDeclarationSelectionChange(event) {
    const state = {fqn: event.target.value};
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
    const panes = [
      { menuItem: 'Model Editor', render: () => (<Tab.Pane>
        <form>
          <div className="ui form">
            <textarea
              value={this.state.model}
              onChange={this.handleModelTextAreaChange.bind(this)}
              className={'form-control Text-area'}
              placeholder="Paste a model file"/>
          </div>
        </form>
      </Tab.Pane>) },
    ];

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
      <div className="App container ui form">
        <h2>Concerto Form Generator - Demo Client</h2>
        <p>This tool demonstrates the <em>concerto-ui</em> library to generate a form from an Accord Project Concerto model.</p>
        <p>This demo produces a ReactJS form that is styled with Semantic UI.</p>
        <Tab panes={panes} />
        <p>Choose a type from this dropdown to generate a form</p>
        <div className='field'>
          <label>Declaration Selection</label>
          <select className='ui fluid dropdown'
            onChange={this.handleDeclarationSelectionChange.bind(this)}
            value={this.state.fqn}>
            {this.state.types.map((type)=>{
              const fqn = type.getFullyQualifiedName();
              return <option key={fqn} value={fqn}>{fqn}</option>;
            })}
          </select>
        </div>
        <div className="ui segment">
          <h2>Form</h2>
          <div >
            {form}
          </div>
        </div>
        <div className="ui segment">
          <h2>JSON</h2>
          <div className='ui form field'>
            <textarea
              value={JSON.stringify(this.state.json, null, 2)}
              onChange={this.handleJsonTextAreaChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
