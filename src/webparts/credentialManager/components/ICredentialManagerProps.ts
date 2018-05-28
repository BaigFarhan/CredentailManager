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
  SitrUrl:string;
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
}
