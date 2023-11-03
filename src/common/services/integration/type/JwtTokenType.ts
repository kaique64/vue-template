export interface JwtTokenType {
  appid: string;
  apptype: string;
  aud: string;
  auth_time: Date;
  authmethod: string;
  ctry: string;
  name: string;
  domain: string;
  email: string;
  exp: number;
  given_name: string;
  iat: number;
  iss: string;
  nbf: number;
  office: string;
  samaccountname: string;
  scp: string;
  street: string;
  family_name: string;
  upn: string;
  ver: string;
  groups: string[];
  roles: string[];
}
