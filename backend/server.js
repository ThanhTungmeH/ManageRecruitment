const express = require("express");
require('dotenv').config()
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mysql = require("mysql2");
const app = express();
const port = 3001;
const { initializeTransporter } = require('./emailService');
const aiScreeningRoutes = require('./aiScreeningRoutes');
const applicationsRouter = require("./applications");
const interviewRoutes = require('./interview');
const jobRoutes = require('./job');
const dashboardRoutes = require('./dashboardRouters');

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
});

// CORS configuration
const corsOptions = {
  origin: "https://manage-recruitment.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware to attach database connection
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Passport serialize/deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://manage-recruitment-api.vercel.app/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const displayName = profile.displayName;
      const email = profile.emails?.[0]?.value || "";
      const avatar = profile.photos?.[0]?.value || "";
      const role = "user";

      const query = `
    INSERT INTO users (google_id, name, email, avatar_url, role)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), avatar_url = VALUES(avatar_url)
  `;

      db.query(
        query,
        [googleId, displayName, email, avatar, role],
        (err, results) => {
          if (err) {
            return done(err, null);
          }
          const user = {
            id: googleId,
            name: displayName,
            email,
            avatarUrl: avatar,
            role,
          };
          return done(null, user);
        }
      );
    }
  )
);

// Authentication middleware - ĐỊNH NGHĨA TRƯỚC KHI SỬ DỤNG
const authenticateUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const googleId = req.user.id;
  db.query(
    "SELECT * FROM users WHERE google_id = ?",
    [googleId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = {
        ...req.user,
        dbId: results[0].id,
        role: results[0].role,
      };
      next();
    }
  );
};

// Database connection
db.connect((err) => {
  if (err) {
    return;
  }
  console.log("Connected to MySQL database");
});

// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("https://manage-recruitment.vercel.app");
  }
);

// Profile route
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const googleId = req.user.id;
  db.query(
    "SELECT * FROM users WHERE google_id = ?",
    [googleId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      res.json({
        email: user.email,
        avatarUrl: user.avatar_url,
        name: user.name,
        role: user.role,
      });
    }
  );
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});



// Khởi tạo email service khi start server
const startServer = async () => {
  try {
    // Khởi tạo email transporter
    await initializeTransporter();
    console.log('✅ Email service initialized');
    
    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Applications routes - SỬ DỤNG authenticateUser SAU KHI ĐỊNH NGHĨA
app.use("/api/applications", authenticateUser);
app.use("/api/applications", applicationsRouter);
app.use('/api/interviews',authenticateUser ,interviewRoutes);
app.use('/api/ai-screening', aiScreeningRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);





 
