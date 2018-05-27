import * as React from 'react';
import styles from './CredentialManagerHome.module.scss';
import { ICredentialManagerHomeProps } from './ICredentialManagerHomeProps';
import { escape } from '@microsoft/sp-lodash-subset';

import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import * as pnp from 'sp-pnp-js';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import { Data } from './Data'
import { IData } from './IData'
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Button, Modal } from 'react-bootstrap';
var CryptoJS = require("crypto-js");
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormControl, GridForm, Form, FormGroup, Col, Fieldset, Row, Field } from 'react-gridforms';
import {
  SPHttpClient,
  SPHttpClientBatch,
  SPHttpClientResponse, SPHttpClientConfiguration
} from '@microsoft/sp-http';


export default class CredentialManagerHome extends React.Component<ICredentialManagerHomeProps, {}> {
  protected onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error?: any) => void): void => {
      pnp.setup({
        sp: {
          headers: {
            "Accept": "application/json; odata=nometadata"
          }
        }
      });
      resolve();
    });
  }

  public state: ICredentialManagerHomeProps;

  constructor(props, context) {

    super(props);
    this.state = {
      description: "",
      SiteURL: 'https://arabtec.sharepoint.com/sites/dev',
      Data: this.props.Data,
      ModelShow: false,
      ID: "",
      SelectRecordUserPwd: "",
      ShowFooter: false,
      UserEnteredPwd: "",
      key: "",
      hidebutton: true,
      value: '',
      copied: false,
      DecryptedPassword:"",

    }

    this.OpenModal = this.OpenModal.bind(this);
    this.CloseModal = this.CloseModal.bind(this);
    this.ShowPassword = this.ShowPassword.bind(this);
    this.CopyToClipBoard = this.CopyToClipBoard.bind(this);
    SPComponentLoader.loadScript('https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table.min.js');
    SPComponentLoader.loadCss('https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
  }

  componentDidMount() {
    this.GetCredentailManagerList();
  }
  public OnChangePasswordKey(event: any): void {
    this.setState({ value: event.target.value });
    this.setState({ copied: false });

  }

  CloseModal() {
    this.setState({ ModelShow: false });
    return false;
  }
  CopyToClipBoard(e) {
    debugger;
    var copyText =document.getElementById("userkey");

    copyText[0].select();
    document.execCommand('copy');
  }
  ShowPassword(e) {
    this.setState({ hidebutton: false }); // yeh copy to clipbard button show kare ga
    if (this.state.UserEnteredPwd == '') {
      return false;
    }
    debugger;
    var encryptKey = CryptoJS.AES.decrypt(this.state.UserEnteredPwd, this.state.value);
    var plaintext = encryptKey.toString(CryptoJS.enc.Utf8);
    this.setState({DecryptedPassword:plaintext});
    //if (encryptKey.toString(CryptoJS.enc.Utf8) == this.state.UserEnteredPwd) {
      
     // alert('farhan');
      //this.setState({ ModelShow: false });
    //}
  }
  OpenModal(e) {
    debugger;
    this.setState({ ModelShow: true });
    this.setState({ ID: e.ID });
    this.setState({ UserEnteredPwd: e.Password });
    this.setState({ key: e.Key });

  }
  onCopy = () => {
    this.setState({ copied: true });
  };

  GetCredentailManagerList() {
    var reactHandler = this;
    var reqUrl = reactHandler.state.SiteURL + "/_api/lists/getbytitle('CredentialManager')/items";
    $.ajax({
      url: reqUrl, type: "GET",
      headers:
        {
          "accept": "application/json;odata=verbose"
        }
    }).then((response) => {
      this.setState({ Data: response.d.results });
    });

  }
  public render(): React.ReactElement<ICredentialManagerHomeProps> {
    const buttonFormatter = (cell, row) => {
      return <button className={styles.btnresponsive} onClick={() => this.OpenModal(row)}>Encrypt Password</button>;   //<span onClick={() => this.OpenModal(row)}>Encrypt</span>;
    };
    const styled = this.state.hidebutton ? { 'display': 'none' } : {};
    return (
      <div className={styles.credentialManagerHome}>
        <Modal show={this.state.ModelShow} onHide={this.CloseModal}>
          <Modal.Header >
            <Modal.Title>Provide Password Key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GridForm>
              <Row>
                <Field span={1}>
                  <label>Enter The Password Key :</label>
                  {/* <input type="password" id="userkey"
                    value={this.state.UserInputPasswordKey}
                    onChange={this.OnChangePasswordKey.bind(this)} /> */}
                  <input value={this.state.value}
                    onChange={this.OnChangePasswordKey.bind(this)} />

                </Field>
              </Row>
            </GridForm>
            <br />
            <button className={"btn btn-success"} onClick={this.ShowPassword.bind(this)}>Show Password</button> &nbsp;
            <button className={'btn btn-primary'} onClick={this.CloseModal.bind(this)}>Close</button>
            &nbsp;
            <CopyToClipboard text={this.state.DecryptedPassword}
              onCopy={() => this.setState({ copied: true })}>
              <button className={'btn btn-info'} style={styled}>Copy to clipboard</button>
            </CopyToClipboard>
          </Modal.Body>
        </Modal>
        <BootstrapTable
          // tableStyle={ { border: 'black 1px solid' } }
          containerStyle={{ border: '#46b8da 1px solid' }}
          // headerStyle={ { border: 'black 1px solid' } }
          bodyStyle={{ border: '#46b8da 1px solid' }}
          striped={true} hover={true} condensed={true} data={this.state.Data} pagination={true}>
          <TableHeaderColumn isKey dataField='UserName1'>User Name</TableHeaderColumn>
          <TableHeaderColumn dataField='AppName'>App Name</TableHeaderColumn>
          <TableHeaderColumn dataField='Password'>Get</TableHeaderColumn>
          <TableHeaderColumn dataFormat={buttonFormatter}></TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
  
}
