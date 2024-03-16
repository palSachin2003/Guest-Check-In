import Guest from './CheckUser.Model.js'
import multer from "multer";
import fs from 'fs'
import path from "path";

const storsge = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync('./upload')) {
            cb(null, './upload');
        } else {
            fs.mkdirSync('./upload', true)
            cb(null, './upload');
        }
    },

    filename: function (req, file, cb) {
        const imgName = file.originalname;
        const imgArr = imgName.split(".");
        imgArr.pop();
        const extImg = path.extname(imgName);
        const imageName = imgArr.join(".") + "-" + Date.now() + extImg;
        cb(null, imageName);

    },
});

const upload = multer({
    storage: storsge,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/svg" ||file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            cb(new Error("Only .jpeg or .png files are allowed!"), false);
        }
    },
});


export const getallUser = async (req, res) => {
    try {
        const categoryData = await Guest.find({});
        res.status(200).json({
            Data: categoryData,
            message: "Category data Successfully Fatched!",
            path: "http://localhost:8080:/upload/",
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}


export const addUser = (req, res) => {
    const uploadFile = upload.single("image");

    uploadFile(req, res, async (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        try {
            const { firstName, lastName, cruiseName, cabinNumber, passportNumber, cruiseBookingId } = req.body;
            let image = "";
            if (req.file !== undefined) {
                image = req.file.filename;
            }

            // Create a new CheckUser document
            const userData = new Guest({
                firstName: firstName,
                lastName: lastName,
                cruiseName: cruiseName,
                cabinNumber: cabinNumber,
                image: image,
                passportNumber: passportNumber,
                cruiseBookingId: cruiseBookingId,
            });

            // Save the document to the database
            const savedUser = await userData.save();

            // Respond with the saved document
            res.status(201).json({
                Data: savedUser,
                message: "Successfully added user data!",
            });
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    });
};







export const updateUser = async (req, res) => {
    const uploadFile = upload.single("image");

    uploadFile(req, res, async (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        try {
            const { firstName, lastName } = req.body;
            const userID = req.params._id;

            const userData = await Guest.findById(userID);
            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }

            let image = userData.image;
            if (req.file) {
                image = req.file.filename;
                if (userData.image && fs.existsSync("./upload/" + userData.image)) {
                    fs.unlinkSync("./upload/" + userData.image);
                }
            }

            const updatedUserData = await Guest.findByIdAndUpdate(userID, {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    image: image
                }
            }, { new: true }); // Returns the updated document

            res.status(200).json({
                Data: updatedUserData,
                message: "User data successfully updated!"
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};


export const findUserByDetails = async (req, res) => {
    try {
        const { firstName, lastName, cruiseName, cabinNumber, cruiseBookingId, passportNumber } = req.body;

        // Ensure all required fields are provided
        if (!firstName || !lastName || !cruiseName || !cabinNumber|| !cruiseBookingId|| !passportNumber) {
            return res.status(400).json({
                message: "Missing required fields: firstName, lastName,cruiseName."
            });
        }

        const user = await Guest.findOne({
            firstName: firstName,
            lastName: lastName,
            cruiseName: cruiseName,
            cabinNumber: cabinNumber,
            passportNumber: passportNumber,
            cruiseBookingId: cruiseBookingId,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Respond with the found user
        res.status(200).json({
            Data: user,
            message: "User successfully found.",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


