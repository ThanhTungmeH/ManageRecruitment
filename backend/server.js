const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mysql = require("mysql2");
const app = express();
const port = 3001;

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "lax",
      secure: false,
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
      clientID:
        "",
      clientSecret: "",
      callbackURL: "/auth/google/callback",
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
            console.error("Error saving user to database:", err);
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
    console.error("Error connecting to MySQL:", err);
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
    res.redirect("http://localhost:5173");
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
        console.error("Error fetching user from database:", err);
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
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Applications routes - SỬ DỤNG authenticateUser SAU KHI ĐỊNH NGHĨA
app.use("/api/applications", authenticateUser);
const applicationsRouter = require("./applications");
app.use("/api/applications", applicationsRouter);

// Jobs API Routes
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.get("/api/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  db.query("SELECT * FROM jobs WHERE id = ?", [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json(results[0]);
  });
});
app.post("/api/jobs/update-applicant-counts", (req, res) => {
  const query = `
        UPDATE jobs j
        SET num_applicants = (
            SELECT COUNT(*) 
            FROM applications a 
            WHERE a.job_id = j.id
        )
    `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  });
});

app.post("/api/jobs", (req, res) => {
  const {
    title,
    department,
    location,
    employment_type,
    description,
    requirements,
    benefits,
    skills_required,
    experience_level,
    urgency_level,
    salary,
    deadline,
    status,
    address,
  } = req.body;

  const query = `
        INSERT INTO jobs (
            title, department, location, employment_type, description,
            requirements, benefits, skills_required, experience_level,
            urgency_level, salary, deadline, status, num_applicants, posted_date,address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(),?)
    `;

  db.query(
    query,
    [
      title,
      department,
      location,
      employment_type,
      description,
      requirements,
      benefits,
      skills_required,
      experience_level,
      urgency_level,
      salary,
      deadline,
      status,
      address,
    ],
    (err, results) => {
      if (err) {
        console.error("Error creating job:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res
        .status(201)
        .json({ id: results.insertId, message: "Job created successfully" });
    }
  );
});

app.put("/api/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const updates = req.body;

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(jobId);

  const query = `UPDATE jobs SET ${fields}, updated_at = NOW() WHERE id = ?`;

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating job:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json({ message: "Job updated successfully" });
  });
});

app.delete("/api/jobs/:id", (req, res) => {
  const jobId = req.params.id;
    // Xóa applications trước
  db.query("DELETE FROM applications WHERE job_id = ?", [jobId], (err, result) => {
    if (err) {
      console.error("Error deleting applications:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    
    // Sau đó xóa job
  db.query("DELETE FROM jobs WHERE id = ?", [jobId], (err, results) => {
    if (err) {
      console.error("Error deleting job:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json({ message: "Job deleted successfully" });
  });
});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 