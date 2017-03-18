var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body: "String",
    author: "String",
    votes: { type: Number, default: 0 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
});

CommentSchema.methods.vote = function(cb){
    this.votes += 1;
    this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);