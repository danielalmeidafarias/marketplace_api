import 'dotenv/config.js';

const pagarmeAuthConfig = {
  Authorization: `Basic ${Buffer.from(process.env.PAGARME_API_KEY + ':').toString('base64')}`,
};

export default pagarmeAuthConfig;
