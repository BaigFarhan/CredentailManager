import * as React from 'react';
import styles from './CredentialManager.module.scss';
import { ICredentialManagerProps } from './ICredentialManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Button, Modal } from 'react-bootstrap';
import { FormControl, GridForm, Form, FormGroup, Col, Fieldset, Row, Field } from 'react-gridforms'
import { PropertyPaneCheckbox } from '@microsoft/sp-webpart-base';
import Dialog from 'react-bootstrap-dialog';
import * as jquery from 'jquery';
import * as pnp from 'sp-pnp-js';
import {
  SPHttpClient,
  SPHttpClientBatch,
  SPHttpClientResponse, SPHttpClientConfiguration
} from '@microsoft/sp-http';

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
      SitrUrl: 'https://mirzaa.sharepoint.com/sites/dev',
      SucessFullModal: false,
      ErrorModal: false
    }

    this.ShowPopupModal = this.ShowPopupModal.bind(this);
    this.CloseModal = this.CloseModal.bind(this);
    this.CloseSucessFullModal = this.CloseSucessFullModal.bind(this);
    this.CloseErrorModal = this.CloseErrorModal.bind(this);


    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
  }

  CloseModal(e) {

    this.setState({ isModalOpen: false });
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
    debugger;
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
    //this.GetUSerDetails();
  }

  private GetUSerDetails() {

    var reactHandler = this;
    debugger;
    var reqUrl = reactHandler.state.SitrUrl + "/_api/lists/getbytitle('CredentialManager')/items";
    //farhan

    jquery.ajax({
      url: reqUrl, type: "GET",
      headers:
        {
          "accept": "application/json;odata=verbose"
        }
    }).then((response) => {
      console.log(response.d);
      debugger;

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
    //console.log("encrypted text", ciphertext.toString());

    // var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    // console.log("decrypted text", plaintext);

    pnp.sp.web.lists.getByTitle('CredentialManager').items.add({
      'Title': "Some title",
      'AppName': AppName,
      'UserName1': UserId,
      'Password': Cryptopwd.toString(),
      'CMDescription': Description,
    }).then((result): void => {

      this.state.ProjectName = ''
      this.state.UserId = '';
      this.state.Password = '';
      this.state.Key = '';
      var Description = this.state.description = '';
      this.setState({ isModalOpen: false });
      this.setState({ SucessFullModal: true });


    }, (error: any): void => {
      this.setState({ ErrorModal: true });

    });
  }

  public render(): React.ReactElement<ICredentialManagerProps> {
    return (
      <div className={styles.credentialManager} >
        <div className={"well well-sm"}><h3> <span className={"label label-default"}>Sign Up</span></h3></div>

        <Modal show={this.state.isModalOpen} onHide={this.CloseModal}>
          <Modal.Header >
            <Modal.Title>Provide Password Key</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <GridForm>
              <Row>
                <Field span={1}>
                  <label>Enter The Password Key :</label>
                  <input type="password" value={this.state.Key} onChange={this.OnChangeKey.bind(this)} />
                </Field>
              </Row>
            </GridForm>
            <br />
            <button className={"btn btn-success"} onClick={this.SaveData.bind(this)}>Save</button> &nbsp;
            <button className={'btn btn-primary'} onClick={this.CloseModal.bind(this)}>Close</button>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button className={'.btn-primary'} onClick={this.CloseModal}>Close</Button>
          </Modal.Footer> */}
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
              <label>App Name  :</label>
              <input type="text" value={this.state.ProjectName} onChange={this.OnChangeProject.bind(this)} />
            </Field>
          </Row>
          <Row>
            <Field span={4}>
              <label>User Name  :</label>
              <input type="text" value={this.state.UserId} onChange={this.OnChangeUserID.bind(this)} />
            </Field>
          </Row>
          <Row>
            <Field span={4}>
              <label>Password</label>
              <input type="Password" value={this.state.Password} onChange={this.OnChangePassword.bind(this)} />
            </Field>
          </Row>
          <Row>
            <Field span={4}>
              <label>Description</label>
              <input type="text" value={this.state.description} onChange={this.OnChangeDescription.bind(this)} />
            </Field>
          </Row>

          <Row>
            <Field span={4}>
              <button className={'btn btn-info active'} onClick={this.ShowPopupModal}>Submit</button>
            </Field>
          </Row>
        </GridForm>

      </div>
    );
  }
}
