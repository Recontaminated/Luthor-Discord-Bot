import pkg from 'mongoose';

const { Schema, model } = pkg;

const reqString = {
    type: String,
    required: true
}
const GuildSchema = new Schema({
    discordId: reqString,
    minecraft: {
      friendlyName: String,
      UUID: String,
    },
  }, {timestamps: true});



let Guild = model('Guild', GuildSchema) 
  
export { Guild } 