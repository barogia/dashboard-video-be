import { SecurityLevel } from 'src/commons/constants/enum';
import { Home } from '../home/entity/home.entity';
import { User } from '../user/entity/user.entity';

export interface CreateCameraDTO {
  url: string;
  title: string;
  home?: string | Home;
  securityLevel: SecurityLevel;
}
