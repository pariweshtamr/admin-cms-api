import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        default: ""
    },
    slug:{
        type: String,
        required: true,
        default: ""
    },
    parentCat: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
},
    {
    timestamps: true
    }

)

export default CategorySchema