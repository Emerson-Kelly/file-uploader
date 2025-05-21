import { body, query, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Error messages
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const ageErr = "must be a number between 18 and 120.";

// Validation rules for user input
const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Not a valid e-mail address")
    .normalizeEmail(),
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
  });
};

// Controller to handle sign-up form submission
export const signup_post = [validateUser, async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Signup POST body:', req.body);

    try {
      // Validate fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
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
  
      res.status(201).json({ message: 'User created', userId: newUser.id });
      //res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
];