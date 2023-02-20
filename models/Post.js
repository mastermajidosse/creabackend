import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    creator1:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator1:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    video1:{
        type:String,
        default:""
    },
    video2:{
        type:String,
        default:""
    }

},
{
    timestamps: true,
  })

const Post = mongoose.model('Post', postSchema)

export default Post