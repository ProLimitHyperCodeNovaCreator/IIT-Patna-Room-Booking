require('dotenv').config();

let client;

async function getClient() {
  if (client) return client;

  const { Issuer } = await import('openid-client');

  const issuer = await Issuer.discover(
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
  );

  client = new issuer.Client({
    client_id: process.env.AZURE_AD_CLIENT_ID,
    client_secret: process.env.AZURE_AD_CLIENT_SECRET,
    redirect_uris: [process.env.AZURE_AD_REDIRECT_URI],
    response_types: ['code']
  });

  return client;
}

module.exports = getClient;
