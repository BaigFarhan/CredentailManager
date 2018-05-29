import { SPHttpClient } from '@microsoft/sp-http';
import {IData }from './IData'
export interface ICredentialManagerProps {
  description: string;
  isModalOpen:boolean;
  ProjectName:string;
  UserId:string;
  Password:string;
  ShowModal: boolean;
  Key:string,
  spHttpClient: SPHttpClient;
  SucessFullModal:boolean,
  ErrorModal:boolean,
  SiteURL: string;
  Data:IData;
  ModelShow:boolean;
  ID:string;
  SelectRecordUserPwd :string;
  ShowFooter: boolean;
  UserEnteredPwd:string;
  key:string;
  hidebutton:boolean;
  value: '',
  copied: false,
  DecryptedPassword:string;
  AddingItem:boolean;
  ListName:string,
  CurrentUserID: string,
  DeleteModelShow: boolean,
  EditModalShow: boolean
}
