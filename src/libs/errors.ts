/**
 * Copyright (c) Hathor Labs and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum ApiError {
  INVALID_PASSWORD = 'invalid-password',
  UNKNOWN_ERROR = 'unknown-error',
}

export const STATUS_CODE_TABLE = {
  [ApiError.INVALID_PASSWORD]: 400,
  [ApiError.UNKNOWN_ERROR]: 500,
};

export class LambdaError extends Error {
  code: string;

  constructor(message, code: ApiError = ApiError.UNKNOWN_ERROR) {
    super(message);
    this.code = code;
  }
}
