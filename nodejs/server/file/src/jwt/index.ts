// npm i --save jsonwebtoken
// npm i --save-dev @types/jsonwebtoken
import * as jwt from 'jsonwebtoken';
import { create_error_log } from 'src/util';

const error_log_file_name = 'jwt_error_log.log';

/**
 * jwtトークンをエンコードする
 * @param payload
 * @param private_key 秘密鍵
 */
export const encode = <T>(payload: T, private_key: jwt.Secret): string => {
  try {
    return jwt.sign(payload as {}, private_key, { algorithm: 'RS256' });
  } catch (err) {
    // エラーログ作成
    create_error_log(error_log_file_name, String(err));
    throw new Error('jwtトークンのエンコード失敗');
  }
};

/**
 * jwtトークンをデコードする
 * @param token
 * @param public_key 公開鍵
 */
export const decode = <T>(token: string, public_key: Buffer): Promise<T> => {
  return new Promise((resolve) => {
    try {
      if (token == null || token === 'null' || token === '') {
        resolve(null);
        return;
      }

      jwt.verify(token, public_key, (err, decoded: {}) => {
        if (err) {
          // エラーログ作成
          create_error_log(error_log_file_name, String(err));
          resolve(undefined);
          return;
        }

        resolve(decoded as T);
      });
    } catch (err) {
      resolve(null);
    }
  });
};
