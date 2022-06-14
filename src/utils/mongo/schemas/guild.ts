import pkg from 'mongoose';

const { Schema, model } = pkg;

const reqString = {
    type: String,
    required: true,
};

const reqNumber = {
    type: Number,
    required: true,
};
const GuildSchema = new Schema(
    {
        guildId: reqString,
        features: {
            counting: {
                countingChannelId: Number,
                countingCounter: Number,
            },
        },
        prefix: String,


    },
    { timestamps: true }
);

let Guild = model('Guild', GuildSchema);

export { Guild };
