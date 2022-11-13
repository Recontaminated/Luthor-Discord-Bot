import pkg from "mongoose";

const { Schema, model } = pkg;

const reqString = {
  type: String,
  required: true,
};
const PlayerSchema = new Schema(
  {
    discordId: reqString,
    minecraft: {
      friendlyName: String,
      UUID: String,
    },
  },
  { timestamps: true }
);

const Player = model("Player", PlayerSchema);

export { Player };
