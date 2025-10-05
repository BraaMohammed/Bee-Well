import mongoose from "mongoose";
import { Schema } from "mongoose";


const dailyEntrySchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        date: { type: String, required: true },
        entries: [{
            categoryIndex: { type: Number, required: true },
            categoryName: {type: String} , 
            elements: [{
                elementIndex: { type: Number, required: true },
                userInput: Schema.Types.Mixed ,  // Store user input for the habit element
                elementType : { type: String} , 
                elementText : { type: String} , 
                target: { type: String} 
            }]
        }]
    }
)

const DailyEntry = mongoose.models.DailyEntry || mongoose.model('DailyEntry', dailyEntrySchema)

export default DailyEntry






