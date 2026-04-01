import { BaseResponse } from './generic-response.interface';
import { Ciudad } from './persona.interfaces';

export interface ListResponse extends BaseResponse {
  data: Ciudad[];
}
