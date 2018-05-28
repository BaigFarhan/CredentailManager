 
import {IData }from './IData'

export interface ICredentialManagerHomeProps {
  description: string;
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

}
