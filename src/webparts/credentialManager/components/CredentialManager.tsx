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
    this.state={
      description: "",
      ProjectName: "",
      UserId: "",
      Password: "",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  
  public OnChangeProject(event: any): void {
    this.setState({ ProjectName: event.target.value });
  }

  public OnChangeUserID(event: any): void {
    this.setState({ UserId: event.target.value });
  }

  public OnChangePassword(event: any): void {
    this.setState({ Password: event.target.value });
  }

  public OnChangeDescription(event: any): void {
    this.setState({ description: event.target.value });
  }

  handleClick(e) {
    e.preventDefault();
     //alert('f'); return false;
     
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
                    <input type="text"  value={this.state.ProjectName} onChange={this.OnChangeProject.bind(this)} />
                </Field>
                  
                </Row>
                <Row>
                  <Field span={4}>
                    <label>User Name  :</label>                    
                    <input type="text"  value={this.state.UserId} onChange={this.OnChangeUserID.bind(this)} />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                    <label>Password</label>                    
                    <input type="Password"  value={this.state.Password} onChange={this.OnChangePassword.bind(this)} />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                    <label>Description</label>
                    <input type="text"  value={this.state.description} onChange={this.OnChangeDescription.bind(this)} />
                  </Field>
                 
                </Row>
                <Row>
                  <Field span={4}>
                  <input type="submit"  onClick={this.handleClick} />                 
                  
                  </Field>
                 
                </Row>

            </GridForm>
{this.state.UserId}
{this.state.Password}
{this.state.ProjectName}
     
      </div> 
    
   )
  }
}

