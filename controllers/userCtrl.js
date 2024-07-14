const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send({ message: 'User Already Exist', success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: 'Register Succesfully', success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

// login 
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: 'user not found', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid Email or password', success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).send({ message: 'Login success', success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        message: 'user not found',
        success: false
      });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error
    });
  }
};

// Google login controller
const googleLoginController = async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({ email, name, password: 'google-login' }); 
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).send({ message: 'Login success', success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};

// Google register controller
const googleRegisterController = async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).send({ message: 'User Already Exist', success: false });
    }

    user = new userModel({ email, name, password: 'google-register' }); // Vous pouvez utiliser un mot de passe fictif
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).send({ message: 'Register success', success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};

module.exports = { loginController, registerController, authController, googleLoginController, googleRegisterController };
