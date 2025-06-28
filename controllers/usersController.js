import { body, query, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Validation rules for user input
const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Not a valid e-mail address")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists");
      }
      return true;
    }),

  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, and a number."
    )
    .escape(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match.")
    .escape(),
];

// Controller to render sign-up page
export const usersCreateGet = (req, res) => {
  res.render("pages/sign-up", {
    title: "Create user",
    errors: [],
    userExists: false,
  });
};

// Controller to handle sign-up form submission
export const signup_post = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/sign-up", {
        title: "Sign-Up",
        errors: errors.array(),
        userExists: false,
        email: req.body.email,
      });
    }

    const { email, password } = req.body;

    try {
      // Validate fields
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user in database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.redirect("/login");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
];
