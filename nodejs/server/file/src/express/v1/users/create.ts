import * as Express from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import { create } from 'src/mongoose/model/users';

import { shaping_ip } from 'src/util';
import { constant } from 'src/constant';
import { i_custom_requst } from 'src/interface';
import { encode } from 'src/jwt';

interface i_requst extends i_custom_requst {
  body: {
    name: string;
    iconId: number;
  };
}

// 秘密鍵
const private_key: jwt.Secret = fs.readFileSync(
  `${process.cwd()}/key/private-key.pem`
);

export const create_user = async (req: i_requst, res: Express.Response) => {
  try {
    if (req.query.status !== '0') {
      res.send({
        [constant.STATUS]: req.query.status,
      });
      return;
    }

    const _ret = await create({
      name: String(req.body.name),
      iconId: Number(req.body.iconId),
      ip: shaping_ip(req),
    });

    // クッキーセット
    res.cookie(constant.JWT_TOKEN, encode({ id: _ret[0].id }, private_key), {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 100, // 100年
      httpOnly: true
    });

    res.send({
      [constant.STATUS]: '1',
    });
  } catch (e) {
    res.sendStatus(500);
  }
};
