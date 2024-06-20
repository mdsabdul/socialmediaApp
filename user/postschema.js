const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Title is required"],
            minLength: [4, "Title must be at least 4 characters long"],
        },
        media: {
            type: String,
            required: [true, "Media is required"],
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Use "User" as the reference name
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
