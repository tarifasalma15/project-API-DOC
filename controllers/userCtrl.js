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
    
    const { name, email, role } = req.body;
    
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role 
    });


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
    const token = jwt.sign({ id: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
          role: user.role,
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
    const { email, name, role} = req.body;

    if (!role) {
      return res.status(400).send({ message: 'Role is required', success: false });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({ email, name, password: 'google-login', role }); 
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).send({ message: 'Login success', success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};

// Google register controller
const googleRegisterController = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    console.log("Request Body:", req.body);
    if (!role) {
      return res.status(400).send({ message: 'Role is required', success: false });
    }

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(409).send({ message: 'User Already Exist', success: false });
    }

    user = new userModel({ email, name, password: 'google-register', role }); 
    await user.save();

    const token = jwt.sign({ id: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).send({ message: 'Register success', success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await userModel.find({ role: 'doctor' });
    res.status(200).send({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error in fetching doctors' });
  }
};

// Get doctor by ID
const getDoctorController = async (req, res) => {
  try {
    const doctor = await userModel.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send({ success: false, message: 'Doctor not found' });
    }
    res.status(200).send({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Error in fetching doctor details' });
  }
};
module.exports = { loginController, registerController, authController, googleLoginController, googleRegisterController, getAllDoctorsController, getDoctorController };
