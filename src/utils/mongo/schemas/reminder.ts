import pkg from 'mongoose';

const { Schema, model } = pkg;

const reqString = {
    type: String,
    required: true
}
const reqNumber = {
  type: Number,
  required: true
}
const ReminderSchema = new Schema({
    creatorId: reqString,
    orginalMessage: reqString,
    duration: reqNumber,
    reminder: reqString,
    createdAt: reqNumber
  });

let Reminder = model('Reminder', ReminderSchema) 
  
export { Reminder } 