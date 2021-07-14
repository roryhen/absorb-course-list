import { absorbURL } from './env.js';
import got from 'got';
import auth from './auth.js';

export default async function getAbsorb(resource) {
  const authToken = await auth();

  const options = {
    headers: {
      Authorization: authToken,
    },
  };

  const result = await got(`${absorbURL}/api/Rest/v1/${resource}`, options).json();
  return result;
}
