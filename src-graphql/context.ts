import { Photon } from './generated/photon';

export interface Context {
  photon: Photon;
  event: any;
  verifiedJwtToken: any; // Add your JwtToken here
}
