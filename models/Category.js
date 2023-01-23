import mongoose from 'mongoose'

const categorySchema = mongoose.Schema({
    name: {
        en:{
            type: String,
            default:""
        },
        ar:{
            type:String,
            default:""
        }
    },
    color:{
        type:String,
        required:true
    },
    keywords:[String]
},
{
    timestamps: true
})

const Category = mongoose.model('Category',categorySchema)

export default Category



// enum: ['thrive', 'invention', 'big', 'digital', 'incubator', 'competition','art','Others'],