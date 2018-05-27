import { SPHttpClient } from '@microsoft/sp-http';
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
  ErrorModal:boolean
}
