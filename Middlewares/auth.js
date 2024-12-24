const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
    try {

        const token = req.header("Authorization")?.replace("Bearer ","") || req.cookies.token ;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login first",
            });
        }

        try {

            const playload = jwt.verify(token, process.env.TOKEN_KEY);
            console.log(playload);
            req.user = playload;

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: "invalid token",
            });

        }

        next();

    } catch (error) {
          console.log(error)
        return res.status(500).json({
            success: false,
            message: "something went wrong",
        });

    }
};

