var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var downloadSchema = new Schema({
  uuid: String,
  user_email: String,
  timestamp: Date,
  which_file: String,
  which_distributor: String,
  number_of_downloads: Number,
  number_of_downloads_limited: Boolean,
  number_of_downloads_limited_to: Number,
  open_to_subscribers: Boolean,
  is_encrypted: Boolean,
  is_production_data: Boolean,
  is_active: Boolean
},{collection:"download_info"})

var Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
