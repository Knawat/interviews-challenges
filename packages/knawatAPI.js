import fetch from "node-fetch";
import qs from "qs";

/**
 * Knawat API
 */
class KnawatAPI {
  // construct new knawat API class
  constructor() {
    this.init();
  }

  //Init function
  init() {
    this.baseUrl = "https://dev.mp.knawat.io/api";
  }

  //Set auth headers
  headers() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.AccessToken}`
    };
  }
  // get Access token from api
  async getAccessToken() {
    var tokenrequestBody = JSON.stringify({
      consumerKey: "749d9378-3a69-4fbc-8b38-489df242887d",
      consumerSecret: "8c7363bc-d4ac-4367-97e4-ae8cb1c7a432"
    });
    var tokenRequest = await this.$fetch("POST", `/token`, {
      body: tokenrequestBody
    });
    // Set access token in api for future use
    this.AccessToken = tokenRequest.channel.token;
    return tokenRequest.channel.token;
  }

  async getProductsfromAPI() {
    var productRequest = await this.$fetch("GET", `/catalog/products`);
    return productRequest ? productRequest : null;
  }
  /**
   * Fetch data from server
   */
  $fetch(method, endpoint, options = {}) {
    let requestUrl = `${this.baseUrl}${endpoint}`;
    if (options.queryParams) {
      requestUrl += `?${qs.stringify(options.queryParams)}`;
    }
    return fetch(requestUrl, {
      method: method,
      headers: this.headers(),
      ...options
    }).then(async res => {
      if (res.status === 404) {
        return null;
      }
      const jsonRes = await res.json();
      if (res.ok) {
        return jsonRes;
      }
      throw {
        statusCode: res.status,
        ...jsonRes
      };
    });
  }
}

export default KnawatAPI;
