import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image_url: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },
        description: {
            type: String,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
        },

        tags: [String],
        sku: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false }
);

export const Product = mongoose.model("Product", ProductSchema);