// importing mongose 
import mongoose from "mongoose";
// creating new playlistschema
const playlistSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  title: { type: String, required: true },
  description: { type: String },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  saveBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
