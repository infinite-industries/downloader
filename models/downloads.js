const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
  uuid: String,
  user_email: String,
  timestamp: Date,
  which_file: String,
  size_of: Number,
  which_distributor: String,
  number_of_downloads: Number,
  number_of_downloads_limited: Boolean,
  number_of_downloads_limited_to: Number,
  open_to_subscribers: Boolean,
  is_encrypted: Boolean,
  is_production_data: Boolean,
  is_active: Boolean
}, {collection: "download_info"});

const Download = mongoose.model("Download", downloadSchema);

module.exports = Download;
