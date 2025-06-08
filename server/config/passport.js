const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        // Create user if not exists
        if (!user) {
          const isAdmin = email === process.env.ADMIN_EMAIL;

          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              role: isAdmin ? "ADMIN" : "USER", // ✅ Properly saved to DB
            },
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
