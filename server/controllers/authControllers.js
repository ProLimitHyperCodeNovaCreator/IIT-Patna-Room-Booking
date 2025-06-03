const getClient = require('../config/openIdClient');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaConfig'); // 👈 import Prisma

const login = async (req, res) => {
  const client = await getClient();
  const url = client.authorizationUrl({
    scope: 'openid email profile',
  });
  res.redirect(url);
};

const callback = async (req, res) => {
  const client = await getClient();
  const params = client.callbackParams(req);
  const tokenSet = await client.callback(process.env.AZURE_REDIRECT_URI, params);
  const userInfo = tokenSet.claims();

  const email = userInfo.preferred_username;
  const name = userInfo.name;
  const oid = userInfo.oid;

  // ✅ Check if user exists
  let user = await prisma.user.findUnique({ where: { email } });

  // ✅ If not, create user
  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
      }
    });
  }

  if(user.email === process.env.ADMIN_EMAIL) {
    user.role = 'admin'; // Set role to admin if email matches
  }
  
  const payload = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  });

  res.redirect('/dashboard');
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Logged out successfully'
  });
};

module.exports = {
  login,
  callback,
  logout
};
