import * as React from 'react';
import styles from './CredentialManager.module.scss';
import { ICredentialManagerProps } from './ICredentialManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Button, Modal } from 'react-bootstrap';
import { FormControl, GridForm, Form, FormGroup, Col, Fieldset, Row, Field } from 'react-gridforms'
import { PropertyPaneCheckbox } from '@microsoft/sp-webpart-base';
import Dialog from 'react-bootstrap-dialog';
import * as pnp from 'sp-pnp-js';
import {
  SPHttpClient,
  SPHttpClientBatch,
  SPHttpClientResponse, SPHttpClientConfiguration
} from '@microsoft/sp-http';

import ManagerHomeStyles from './CredentialManagerHome.module.scss';
import { ICredentialManagerHomeProps } from './ICredentialManagerHomeProps';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import { BootstrapTable, TableHeaderColumn, InsertButton, SearchField } from 'react-bootstrap-table';
import { Data } from './Data'
import { IData } from './IData'
var CryptoJS = require("crypto-js");
import { CopyToClipboard } from 'react-copy-to-clipboard';


var CryptoJS = require("crypto-js");
export default class CredentialManager extends React.Component<ICredentialManagerProps, {}> {

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

  createCustomSearchField = (props) => {
    return (
      <SearchField className='my-custom-class' />
    );
  }

  public state: ICredentialManagerProps;

  constructor(props, context) {

    super(props);
    this.state = {
      isModalOpen: false,
      description: "",
      ProjectName: "",
      UserId: "",
      Password: "",
      Key: "",
      ShowModal: false,
      spHttpClient: this.props.spHttpClient,
      SucessFullModal: false,
      ErrorModal: false,
      SiteURL: 'https://mirzaa.sharepoint.com/sites/dev',
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
      DecryptedPassword: "",
      AddingItem: false,
      ListName: 'CredentialManager',
      CurrentUserID: "",
      DeleteModelShow: false,
      EditModalShow: false
    }

    this.ShowPopupModal = this.ShowPopupModal.bind(this);
    this.CloseModal = this.CloseModal.bind(this);
    this.CloseSucessFullModal = this.CloseSucessFullModal.bind(this);
    this.CloseErrorModal = this.CloseErrorModal.bind(this);

    this.OpenModal = this.OpenModal.bind(this);
    this.CloseModal = this.CloseModal.bind(this);
    this.ShowPassword = this.ShowPassword.bind(this);
    this.OpenDeleteModal = this.OpenDeleteModal.bind(this);
    this.OpenEditModal = this.OpenEditModal.bind(this);
    this.UpdateData = this.UpdateData.bind(this);



    SPComponentLoader.loadScript('https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table.min.js');
    SPComponentLoader.loadCss('https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');


    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
  }

  CloseModal(e) {

    this.setState({ isModalOpen: false });
    this.setState({ ModelShow: false });
    return false;
  }

  CloseSucessFullModal(e) {
    this.setState({ SucessFullModal: false });
    return false;
  }
  CloseErrorModal(e) {
    this.setState({ CloseErrorModal: false });
    return false;
  }
  ShowPopupModal(e) {
    e.preventDefault();

    if (this.state.ProjectName == '') {
      return false;
    }
    else if (this.state.ProjectName == '') {
      return false;
    }
    else if (this.state.Password == '') {
      return false;
    }
    this.setState({ isModalOpen: true });
    e.preventDefault();
    return false;
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


  public OnChangeKey(event: any): void {
    this.setState({ Key: event.target.value });
  }


  componentDidMount() {
    // alert('componentDidMount');
    // this.GetCredentailManagerList();
  }

  componentWillMount() {
    // alert('componentWillMount');
    this.GetCredentailManagerList();
    //this.GetCredentailManagerList();
  }

  ShowPassword(e) {
    // yeh copy to clipbard button kare ga
    if (this.state.UserEnteredPwd == '') {
      return false;
    }

    var encryptKey = CryptoJS.AES.decrypt(this.state.UserEnteredPwd, this.state.value);
    var plaintext = encryptKey.toString(CryptoJS.enc.Utf8);
    if (plaintext != "") {
      this.setState({ DecryptedPassword: plaintext });
      this.setState({ hidebutton: false });
    }
    else {
      this.setState({ DecryptedPassword: "Ooops!!!! Wrong Key" });
    }
  }
  OpenModal(e) {

    this.setState({ ModelShow: true });
    this.setState({ ID: e.ID });
    this.setState({ UserEnteredPwd: e.Password });
    this.setState({ key: e.Key });

  }

  OpenDeleteModal(e) {
    this.setState({ DeleteModelShow: true });
    this.setState({ ID: e.ID });
  }

  OpenEditModal(e) {

    this.setState({ ProjectName: e.AppName });
    this.setState({ UserId: e.UserName1 });
    this.setState({ description: e.CMDescription });
    this.setState({ EditModalShow: true });
    this.setState({ ID: e.ID });
  }
  CloseEditModal = () => {
    this.setState({ ProjectName: '' });
    this.setState({ UserId: '' });
    this.setState({ description: '' });
    this.setState({ Key: '' });
    this.setState({ EditModalShow: false });
  };
  UpdateData(e) {//far
    var reactHandler = this;
    if (this.state.Key == '') {
      return false;
    }
    if (this.state.ProjectName == '') {
      return false;
    }
    else if (this.state.ProjectName == '') {
      return false;
    }
    else if (this.state.Password == '') {
      return false;
    }
    else if (this.state.description == '') {
      return false;
    }
    var Cryptopwd = CryptoJS.AES.encrypt(this.state.Password, this.state.Key);
    let list = pnp.sp.web.lists.getByTitle(this.state.ListName);

    list.items.getById(parseInt(this.state.ID)).update({
      'Title': "Some title",
      'AppName': reactHandler.state.ProjectName,
      'UserName1': reactHandler.state.UserId,
      'Password': Cryptopwd.toString(),
      'CMDescription': reactHandler.state.description,
    }).then((result): void => {
      this.setState({ EditModalShow: false });
      this.setState({ ProjectName: '' });
      this.setState({ UserId: '' });
      this.setState({ description: '' });
      this.setState({ Key: '' });
      this.setState({ SucessFullModal: true });
      this.GetCredentailManagerByCreatedUser();
    }, (error: any): void => {
      this.setState({ ErrorModal: true });

    });
  };
  onCopy = () => {
    this.setState({ copied: true });
  };

  CloseDeleteModal = () => {
    this.setState({ DeleteModelShow: false });
  };

  DeleteRecord(e) {
    let list = pnp.sp.web.lists.getByTitle(this.state.ListName);
    list.items.getById(parseInt(this.state.ID)).delete().then((response) => {
      this.setState({ DeleteModelShow: false });
      this.GetCredentailManagerByCreatedUser();
      this.setState({ SucessFullModal: true });
    }, (error: any): void => {
      this.setState({ DeleteModelShow: false });
      this.setState({ ErrorModal: true });
    });
  }

  private GetCredentailManagerList() {
    var reactHandler = this;
    var reqUrl = reactHandler.state.SiteURL + "/_api/web/currentUser";
    $.ajax({
      url: reqUrl, type: "GET",
      headers: { "accept": "application/json;odata=verbose" }
    }).then((response) => {
      this.setState({ CurrentUserID: response.d.Id });
      this.GetCredentailManagerByCreatedUser();
    });
  }
  GetCredentailManagerByCreatedUser() {
    var reqUrl = this.state.SiteURL + "/_api/lists/getbytitle('" + this.state.ListName + "')/items?$filter=AuthorId+eq+" + this.state.CurrentUserID;
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

  SaveData(e) {

    var AppName = this.state.ProjectName;
    var UserId = this.state.UserId;
    var PasswordKey = this.state.Password;
    var Description = this.state.description;
    if (this.state.Key == '') {
      return false;
    }

    var Cryptopwd = CryptoJS.AES.encrypt(PasswordKey, this.state.Key);

    pnp.sp.web.lists.getByTitle(this.state.ListName).items.add({
      'Title': "Some title",
      'AppName': AppName,
      'UserName1': UserId,
      'Password': Cryptopwd.toString(),
      'CMDescription': Description,
    }).then((result): void => {

      this.setState({ ProjectName: '' });
      this.setState({ UserId: '' });
      this.setState({ description: '' });
      this.setState({ Key: '' });
      this.setState({ isModalOpen: false });
      this.setState({ SucessFullModal: true });
    }, (error: any): void => {
      this.setState({ ErrorModal: true });

    });
  }

  public OnChangePasswordKey(event: any): void {
    this.setState({ value: event.target.value });
    this.setState({ copied: false });

  }
  public AddCredential() {
    this.setState({ AddingItem: true });
  }
  public CloseAddingCredentials() {
    this.setState({ ProjectName: '' });
    this.setState({ UserId: '' });
    this.setState({ description: '' });
    this.setState({ Key: '' });
    this.setState({ AddingItem: false });
    this.GetCredentailManagerByCreatedUser();

  }

  public render(): React.ReactElement<ICredentialManagerProps> {
    const buttonFormatterDecrypt = (cell, row) => {
      return (
        <div>
          <span onClick={() => this.OpenModal(row)} title="Decrypt Password" style={operationiconcss} className={'glyphicon glyphicon-retweet'}></span>
        </div>
      )
    };
    const buttonFormatterEdit = (cell, row) => {
      return (
        <div>
          &nbsp;<span onClick={() => this.OpenEditModal(row)} title="Edit Record" style={operationiconcss} className={'glyphicon glyphicon-edit'}></span>
        </div>
      )
    };
    const buttonFormatterDelete = (cell, row) => {
      return (
        <div>
          &nbsp;  <span onClick={() => this.OpenDeleteModal(row)} title="Delete Record" style={deleteiconcss} className={'glyphicon glyphicon-remove'}></span>
        </div>
      )
    };

    const operationiconcss = { 'color': '#337ab7', 'cursor': 'pointer', 'width': '8%' };
    const deleteiconcss = { 'color': 'red', 'cursor': 'pointer', 'width': '8%' };
    const btncopyclipcss = this.state.hidebutton ? { 'display': 'none' } : {};
    const options = {
      searchField: this.createCustomSearchField
    };

    return (
      <div className={styles.credentialManager} >
        {
          this.state.AddingItem == true &&
          <div>
            <div className={"well well-sm"}><h3> <span className={"label label-default"}>Sign Up</span></h3></div>
            <Modal show={this.state.isModalOpen} onHide={this.CloseModal}>
              <Modal.Header >
                <Modal.Title>Provide Password Key</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <GridForm>
                  <Row>
                    <Field span={1}>
                      <label><span className={ManagerHomeStyles.required}>*</span> Enter The Password Key :  </label>
                      <input type="password" value={this.state.Key} onChange={this.OnChangeKey.bind(this)} />
                    </Field>
                  </Row>
                </GridForm>
                <br />
                <button className={"btn btn-success"} onClick={this.SaveData.bind(this)}>Save</button> &nbsp;
            <button className={'btn btn-primary'} onClick={this.CloseModal.bind(this)}>Close</button>
              </Modal.Body>
            </Modal>

            <Modal show={this.state.SucessFullModal} >
              <Modal.Body>
                <div className="alert alert-success">
                  <strong>Success!</strong>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="button" onClick={this.CloseSucessFullModal} className="btn btn-default" data-dismiss="modal">Close</button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.ErrorModal} onHide={this.CloseSucessFullModal}>
              <Modal.Body>
                <div className="alert alert-danger">
                  <strong>Success!</strong>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="button" onClick={this.CloseErrorModal} className="btn btn-default" data-dismiss="modal">Close</button>
              </Modal.Footer>
            </Modal>
            <GridForm>
              <Row>
                <Field span={1}>
                  <label><span className={ManagerHomeStyles.required}>*</span> App Name  :</label>
                  <input type="text" value={this.state.ProjectName} onChange={this.OnChangeProject.bind(this)} />
                </Field>
              </Row>
              <Row>
                <Field span={4}>
                  <label><span className={ManagerHomeStyles.required}>*</span> User Name  :</label>
                  <input type="text" value={this.state.UserId} onChange={this.OnChangeUserID.bind(this)} />
                </Field>
              </Row>
              <Row>
                <Field span={4}>
                  <label><span className={ManagerHomeStyles.required}>*</span> Password :</label>
                  <input type="Password" value={this.state.Password} onChange={this.OnChangePassword.bind(this)} />
                </Field>
              </Row>
              <Row>
                <Field span={4}>
                  <label><span className={ManagerHomeStyles.required}>*</span> Description :</label>
                  <input type="text" value={this.state.description} onChange={this.OnChangeDescription.bind(this)} />
                </Field>
              </Row>
              <Row>
                <Field span={4}>
                  <button className={'btn btn-info active'} onClick={this.ShowPopupModal}>Submit</button>
                  &nbsp;
                  <button className={'btn btn-info active'} onClick={this.CloseAddingCredentials.bind(this)}>Close</button>
                </Field>
              </Row>
            </GridForm>
          </div>
        }

        {
          this.state.AddingItem == false &&
          <div className={ManagerHomeStyles.credentialManagerHome}>
            <Modal show={this.state.ModelShow} onHide={this.CloseModal}>
              <Modal.Header >
                <Modal.Title>Provide Password Key</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <GridForm>
                  <Row>
                    <Field span={1}>
                      <label>Enter The Password Key :</label>
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
                  <button className={'btn btn-info'} style={btncopyclipcss}>Copy to clipboard</button>
                </CopyToClipboard>
              </Modal.Body>
            </Modal>
            <Modal show={this.state.DeleteModelShow} onHide={this.CloseModal}>
              <Modal.Header >
                <strong> Are You Sure to Delete?</strong>
              </Modal.Header>
              <Modal.Body>
                <button className={"btn btn-primary"} onClick={this.DeleteRecord.bind(this)}>Yes</button> &nbsp;
                <button className={'btn btn-default'} onClick={this.CloseDeleteModal}>No</button>
              </Modal.Body>
            </Modal>
            <BootstrapTable search options={options}
              containerStyle={{ border: '#46b8da 1px solid' }}
              bodyStyle={{ border: '#46b8da 1px solid' }}
              striped={true} hover={true} condensed={true} data={this.state.Data} pagination={true}>
              <TableHeaderColumn dataAlign="center" isKey dataField='UserName1'>User Name</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" dataField='AppName'>App Name</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" dataField='Password'>Password</TableHeaderColumn>
              <TableHeaderColumn width="8%" dataAlign="center" dataFormat={buttonFormatterDecrypt}></TableHeaderColumn>
              <TableHeaderColumn width="8%" dataAlign="center" dataFormat={buttonFormatterEdit}></TableHeaderColumn>
              <TableHeaderColumn width="8%" dataAlign="center" dataFormat={buttonFormatterDelete}></TableHeaderColumn>
            </BootstrapTable>
            <button className={ManagerHomeStyles.button} onClick={this.AddCredential.bind(this)}>Add Credential</button>
            <Modal show={this.state.EditModalShow} onHide={this.CloseModal}>
              <Modal.Header>
                <div className={"well well-sm"}><h3> <span className={"label label-default"}>Update User Info</span></h3></div>
              </Modal.Header>
              <Modal.Body>
                <GridForm>
                  <Row>
                    <Field span={1}>
                      <label><span className={ManagerHomeStyles.required}>*</span> App Name  :</label>
                      <input type="text" value={this.state.ProjectName} onChange={this.OnChangeProject.bind(this)} />
                    </Field>
                  </Row>
                  <Row>
                    <Field span={4}>
                      <label><span className={ManagerHomeStyles.required}>*</span> User Name  :</label>
                      <input type="text" value={this.state.UserId} onChange={this.OnChangeUserID.bind(this)} />
                    </Field>
                  </Row>
                  <Row>
                    <Field span={4}>
                      <label><span className={ManagerHomeStyles.required}>*</span> Password :</label>
                      <input type="Password" value={this.state.Password} onChange={this.OnChangePassword.bind(this)} />
                    </Field>
                  </Row>
                  <Row>
                    <Field span={4}>
                      <label><span className={ManagerHomeStyles.required}>*</span> Description :</label>
                      <input type="text" value={this.state.description} onChange={this.OnChangeDescription.bind(this)} />
                    </Field>
                  </Row>
                  <Row>
                    <Field span={4}>
                      <label><span className={ManagerHomeStyles.required}>*</span> Key :</label>
                      <input type="text" value={this.state.Key} onChange={this.OnChangeKey.bind(this)} />
                    </Field>
                  </Row>
                </GridForm>
                <br />
                <button className={"btn btn-success"} onClick={this.UpdateData.bind(this)}>Update</button> &nbsp;
                <button className={'btn btn-primary'} onClick={this.CloseEditModal}>Close</button>
              </Modal.Body>
            </Modal>
          </div>
        }
      </div>
    );
  }
}
