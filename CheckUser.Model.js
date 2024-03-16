import mongoose, { Schema } from "mongoose";
const guestSchema = new Schema(
    {
        cruiseName: {
            type: String,
            required: [true, 'Please select Cruise Name'],

        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],

        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],

        },
        cabinNumber: {
            type: Number,
            required: [true, 'Cabin number is required'],

        },
        passportNumber: {
            type: String,
            required: [true, 'Passport is required'],

        },
        cruiseBookingId: {
            type: String,
            required: [true, 'booking ID is required'],

        },
        image: {
            type: String,
            default: null,
        },

    },

);

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);  //creating a model of the user with the UserSchema
export default Guest;

