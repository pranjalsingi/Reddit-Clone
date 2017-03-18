var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    link: String,
    author: String,
    votes: { type: Number, default: 0},
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.vote = function(cb){
  this.votes += 1;
  this.save(cb);
};

module.exports = mongoose.model('Post', PostSchema);