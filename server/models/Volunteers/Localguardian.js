import mongoose from "mongoose";

const localguardianschema= new mongoose.Schema(
    {
        name : {type: String, required : true},
        email : {type: String, reqired : true, unique : true},

    }
);

const Localguardian = mongoose.model('Localguardian', localguardianschema);

export default Localguardian;