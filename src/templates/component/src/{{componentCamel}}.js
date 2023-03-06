import React, { Component } from 'react'

export default class {{componentCamel}}Component extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to {{component}}</h1>
        <p>Data:
          <pre>
            {JSON.stringify(this.props.data, null, 2)}
          </pre>
        </p>
        <p>
          Properties:
          <pre>
            {JSON.stringify(this.props.properties, null, 2)}
          </pre>
        </p>
      </div>
    );
  }
}
