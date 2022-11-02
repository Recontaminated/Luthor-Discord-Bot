import pkg from "mongoose";

const { Schema, model } = pkg;

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};
const featureSchema = new Schema({
  monitor: {
    watchingUrls: [String],
  },
  counting: {
    countingChannelId: Number,
    countingCounter: Number,
  },
  luthorChatChannelId: String,
});

const GuildSchema = new Schema(
  {
    guildId: reqString,
    features: featureSchema,
    prefix: String,
  },
  { timestamps: true }
);

let Guild = model("Guild", GuildSchema);

export { Guild };
