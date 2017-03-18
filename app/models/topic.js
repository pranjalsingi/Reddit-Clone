var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TopicSchema = new Schema({
    name: String,
    author: String,
    votes: { type: Number, default: 0},
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

TopicSchema.methods.vote = function(cb){
    this.votes += 1;
    this.save(cb);
};

module.exports = mongoose.model('Topic', TopicSchema);