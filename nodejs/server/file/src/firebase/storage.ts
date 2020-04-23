const admin = require('firebase-admin');

import { constant } from 'src/constant';

admin.initializeApp({
  storageBucket: constant.FIREBASE_STORAGE,
});

// アップロード
export const upload = async (filename: string, image: Buffer, type: string) => {
  try {
    const _bucket = await admin.storage().bucket();

    const _file = _bucket.file(filename);
    await _file.save(image);
    await _file.setMetadata({
      cacheControl: 'public,max-age=3600',
      contentType: type,
    });
    return true;
  } catch (err) {
    return false;
  }
};

// 削除
export const delete_file = async (filename: string) => {
  try {
    const _bucket = await admin.storage().bucket();
    await _bucket.file(filename).delete();
  } catch (err) {}
};
