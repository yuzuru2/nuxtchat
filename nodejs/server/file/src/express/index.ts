// npm i --save express helmet body-parser cors
// npm i --save-dev @types/express @types/helmet @types/body-parser @types/cors

/**
 * 定数
 */
import { constant } from 'src/constant';

import { v1 } from 'src/express/v1';

export const init = () => {
  switch (constant.API_VERSION) {
    case 'v1':
      v1();
      break;
    default:
      break;
  }
  console.log('start');
};
