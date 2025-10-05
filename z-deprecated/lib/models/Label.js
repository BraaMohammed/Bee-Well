

import mongoose, { Schema, Document } from 'mongoose';

/*const noteSchema = {
  heading: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  label: { type: String, required: true },
}*/


const labelSchema = new mongoose.Schema ({
   name: {type: String , required : true},
   userEmail: { type: String, required: true },
   notes: { type: [String], required: true }
  })

const Label = mongoose.models.Label ||  mongoose.model('Label' , labelSchema ) 

export default Label














/*

import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema({
  name: String,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
});

const Label = mongoose.models.Label || mongoose.model('Label', labelSchema);

export default Label;


*/