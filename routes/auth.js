const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.post('/login', async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        return console.log(err);
    }
})

router.post('/register', async (req, res) => {
    try {
        // Get user input
        const { user_name, full_name, email, password, phone_number, card_uid } = req.body;

        // Validate user input
        if (!(user_name, full_name, email, password, phone_number, card_uid)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ user_name, email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            user_name,
            full_name,
            email,
            password: encryptedPassword,
            phone_number,
            card_uid
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        return res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router