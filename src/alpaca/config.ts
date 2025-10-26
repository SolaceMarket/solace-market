// export const api_key = "CKRH9SF6U0FOV78KPDX0";
// export const api_secret = "Q1HTm4U1NdrGaxJ5DnRf9eAVpyrcUFsstNnTNIkp";

export const api_key = "CK6LIXFH42JRSJJEODGSZPSIY2";
export const api_secret = "6JsNSYHdCnsz57mBkFKcXunMSruPEsukFC9vazfkmbr3";

export const credentials = Buffer.from(`${api_key}:${api_secret}`).toString(
  "base64",
);
export const basicAuth = `Basic ${credentials}`;
console.log("basic auth", basicAuth);

export const baseUrl = "https://broker-api.sandbox.alpaca.markets";

export const headers = {
  Authorization: basicAuth,
  "Content-Type": "application/json",
};
