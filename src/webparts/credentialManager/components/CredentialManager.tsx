import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  {Component} from 'react'
import styles from './CredentialManager.module.scss';
import { ICredentialManagerProps } from './ICredentialManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { FormControl,GridForm,Form, FormGroup,Col,Fieldset, Row, Field } from 'react-gridforms'
import { PropertyPaneCheckbox } from '@microsoft/sp-webpart-base';
 
export default class CredentialManager extends React.Component<ICredentialManagerProps, {}> {
  
  public state: ICredentialManagerProps;
  constructor(props, context) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
     alert('f'); return false;
  }

  
  public render(): React.ReactElement<ICredentialManagerProps> {
    
    return (
      <div className={styles.credentialManager }>
       <h2>Sign up</h2>
       <br/>
      <GridForm>
                <Row>
                  <Field span={1}>
                    <label>App Name  :</label>
                  <input id="appname" type="text"/>
                </Field>
                  
                </Row>
                <Row>
                  <Field span={4}>
                    <label>User Name  :</label>
                    <input  id="username" type="text" />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                    <label>Password</label>
                    <input id="password" type="password" />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                    <label>Description</label>
                    <input type="text" />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                  <input type="submit"  onClick={this.handleClick} />
                  
                  
                  </Field>
                 
                </Row>

            </GridForm>

     
      </div> 
    
   )
  }
}

