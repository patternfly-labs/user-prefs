// @ts-nocheck
import * as React from "react";
import { Button, Title } from '@patternfly/react-core';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div style={{
            border: '1px dashed',
            padding: '8px'
          }}>
            <Title headingLevel="h1" size="lg">Unable to render</Title>
            {this.props.onClear && <Button variant="link" style={{ paddingLeft: '0px' }} onClick={this.props.onClear}>Re-render</Button>}
          </div>
        );
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;
