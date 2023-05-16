import { WarningLevel } from 'src/commons/constants/enum';

export interface IWarningDto {
  name: string;
  urlImage: string;
  description: string;
  warningLevel: WarningLevel;
  home: string;
  camera: string;
}

export type ICreateWarningDto = IWarningDto;
