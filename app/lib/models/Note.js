import mongoose, { Schema, Document } from 'mongoose';



const noteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  heading: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  label: { type: String },
  backgroundColor : {type: String , default: "rgb(64 64 64)" } , 
  htmlContent : { type: String }
})

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

export default Note




/*



import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: Date,
  heading: String
}, {timestamps: true});

const Note = mongoose.model('Note', noteSchema);

export default noteSchema;









*/