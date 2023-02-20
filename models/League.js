import mongoose from 'mongoose'

const leagueSChema = mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   creators:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   ],
   challenges:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
   ]
},
{
    timestamps: true,
  })

const League = mongoose.model('League', leagueSChema)

export default League