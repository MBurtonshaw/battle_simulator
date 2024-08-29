import config from '../config';

export default class Data {
  async api(path, method = 'GET', body = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        if (response.status === 204) {
          return {}; // Handle no content response
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {}; // Handle response body
      } else {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      throw error; // Re-throw error for further handling
    }
  }

  async getHero(id) {
    try {
      return await this.api(`api/hero/${id}`, 'GET');
    } catch (error) {
      console.error('Failed to get hero:', error);
      throw error;
    }
  }

  async addHero(name) {
    try {
      return await this.api('api/hero', 'POST', { name });
    } catch (error) {
      console.error('Failed to add hero:', error);
      throw error;
    }
  }

  async defeatEnemy(heroId, exp) {
    try {
      return await this.api(`api/hero/${heroId}/win`, 'POST', exp)
    } catch(error) {
      console.error('Failed to update after victory:', error);
      throw error;
    }
  }

  async checkForLevelUp(heroId) {
    try {
      console.log(`Sending level up request for hero ID: ${heroId}`);
      const response = await this.api(`api/hero/${heroId}/level`, 'POST');
      return response;
    } catch (error) {
      console.error('Failed to check hero for level:', error);
      throw error;
    }
  }
}