import * as Express from 'express';
import * as fs from 'fs';

import { create } from 'src/mongoose/model/blacklists';
import { find_user } from 'src/mongoose/model/users';
import { shaping_ip } from 'src/util';
import { i_custom_requst } from 'src/interface';
import { decode } from 'src/jwt';
import { constant } from 'src/constant';

// 公開鍵
const public_key: Buffer = fs.readFileSync(
  `${process.cwd()}/key/public-key.pem`
);

export const user = async (
  req: i_custom_requst,
  res: Express.Response,
  next: Express.NextFunction
) => {
  if (
    req.cookies === undefined ||
    Object.keys(req.cookies).filter((m) => m === constant.JWT_TOKEN).length ===
      0
  ) {
    req.query.status = '0';
    next();
    return;
  }

  const _user = await decode<{ id: string }>(req.cookies.jwt_token, public_key);

  if (_user === null) {
    req.query.status = '0';
    next();
    return;
  }

  // 改ざんしたトークンが送られて来たら
  if (_user === undefined) {
    // ブラックリスト入り
    await create(shaping_ip(req.ip));
    res.sendStatus(500);
    return;
  }

  const _ret = await find_user(_user.id);
  if (_ret.length === 0) {
    req.query.status = '0';
    next();
    return;
  }

  req.query.id = _ret[0].id;
  req.query.roomId = _ret[0].roomId;

  if (req.query.roomId === '') {
    req.query.status = '1';
  } else {
    req.query.status = '2';
  }
  next();
};
