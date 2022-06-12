import pkg from 'mongoose';

const { Schema, model } = pkg;

const reqString = {
    type: String,
    required: true
}
const ReminderSchema = new Schema({
    creatorId: reqString,
    orginalMessage: reqString,
    duration: Number,
    reminder: reqString,
    createdAt: reqString
  });

let Reminder = model('Reminder', ReminderSchema) 
  
export { Reminder } 