export interface ApiSuccessResponse {
  responseCode: number;
  status: true;
  name: string;
  message: string;
  data: object;
  meta: object;
}

export interface ApiErrorResponse {
  responseCode: number;
  status: false;
  name: string;
  message: string;
  data: AnyDict;
  meta?: object;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type AnyDict = { [k: string]: any };
