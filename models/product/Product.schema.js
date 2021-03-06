import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: '',
      maxLength: 100,
    },
    slug: {
      type: String,
      required: true,
      default: '',
      unique: true,
      index: 1,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      max: 10000,
    },
    salesPrice: {
      type: Number,
      required: true,
      default: 0,
      max: 10000,
    },
    salesStartDate: {
      type: Date,
      default: null,
    },
    salesEndDate: {
      type: Date,
      default: null,
    },
    brand: {
      type: String,
      default: '',
      maxLength: 50,
    },
    qty: {
      type: Number,
      required: true,
      default: 0,
      max: 10000,
    },
    thumbnail: {
      type: String,
      default: '',
      maxLength: 300,
    },
    images: {
      type: Array,
    },
    description: {
      type: String,
      required: true,
      default: '',
      maxLength: 3000,
    },
    categories: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Product', ProductSchema)
