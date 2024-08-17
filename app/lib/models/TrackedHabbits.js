import mongoose from "mongoose";


const trackedHabbitsSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    habbits: [{
        categoryName: { type: String} , 
        elements: [{
            type: { type: String} , 
            text: { type: String} , 
            emoji: { type: String} , 
            options: [String] , 
            target: { type: String} 

        }]
    }]

})


const TrackedHabbits = mongoose.models.TrackedHabbits || mongoose.model('TrackedHabbits', trackedHabbitsSchema);

export default TrackedHabbits

