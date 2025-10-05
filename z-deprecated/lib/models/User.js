import mongoose, { Schema, Document } from 'mongoose';



const userSchema = new mongoose.Schema ({
   name:  String ,
   email :  String, 
   password : String 
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User



/*





import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  //labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }] // Array of label document IDs
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;













* */