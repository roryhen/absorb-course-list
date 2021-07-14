import { absorbURL, apiKey, username, password } from './env.js';
import got from 'got';

let cachedToken = null;

export default async function auth() {
  if (!cachedToken) {
    const options = {
      responseType: 'json',
      json: {
        Username: username,
        Password: password,
        PrivateKey: apiKey,
      },
    };
    const result = await got.post(
      `${absorbURL}/api/Rest/v1/Authenticate`,
      options
    );
    cachedToken = result.body;
  }
  return cachedToken;
}
