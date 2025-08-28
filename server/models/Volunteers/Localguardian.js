import mongoose from "mongoose";

const localguardianschema= new mongoose.Schema(
    {
        name : {type: String, required : true},
        email : {type: String, required : true, unique : true},
        phone: {type: String, required: true},
        location: {type: String, required: true},
        password: {type: String, required: true},
        roles: {type: String, required: true},

    }
);

const Localguardian = mongoose.model('Localguardian', localguardianschema);

export default Localguardian;