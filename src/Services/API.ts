import jwt from 'jsonwebtoken';
import _ from 'lodash';

export default class API {
  private token: string | undefined = undefined;
  constructor(private basePath: string) {
  }
  private url(path: string) {
    return this.basePath + path;
  }
  private async getToken() {
    try {
      const response = await fetch(this.url('/'));
      const { token } = await response.json();
      return token;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
  private async reFetchTokenIfNeeded() {
    if (this.token) {
      try {
        const { exp } = jwt.decode(this.token) as { exp: number };
        // give it a 10 seconds leeway
        const almostNow = new Date().getTime() - 10 * 1000;
        if (exp < almostNow) {
          // token is valid, exiting function
          return;
        }
      } catch (e) {
        console.error('Error while decoding token', { token: this.token, e });
      }
    }

    // re-fetch
    this.token = await this.getToken();
  }
  private async fetch(path: string, addOptions: RequestInit = {}) {
    try {
      await this.reFetchTokenIfNeeded();
      const init = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      };
      const options = _.merge(init, addOptions);
      return await fetch(this.url(path), options);
    } catch (e) {
      console.error('Error while fetching', { path, addOptions, e });
      // @TODO: show error
    }
  }
  public async getCounter(): Promise<number | undefined> {
    const response = await this.fetch('/counter');
    if (response) {
      const { counter } = await response.json();
      return counter;
    }
  }
  public async bumpCounter(
    performer: string,
    title: string,
    fileName: string,
    cue: string
  ): Promise<number | undefined> {
    const body = JSON.stringify({ performer, title, fileName, cue });
    const response = await this.fetch('/counter', { method: 'POST', body });
    if (response) {
      const { counter } = await response.json();
      return counter;
    }
  }
}
