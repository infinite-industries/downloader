var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var downloadSchema = new Schema({
  uuid: String,
  user_email: String,
  timestamp: Date,
  number_of_downloads: Number,
  which_file: String,
  is_production_data: Boolean,
  is_active: Boolean
},{collection:"download_info"})

var Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
