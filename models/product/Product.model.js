import ProductSchema from './Product.schema.js'

//get all products from db
export const getAllProducts = () => {
  return ProductSchema.find()
}

//get single product
export const getAProductBySlug = (slug) => {
  return ProductSchema.findOne({ slug })
}

export const addProduct = (prodInfo) => {
  try {
    const result = ProductSchema(prodInfo).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// delete category from db
export const deleteAProduct = (_id) => {
  return ProductSchema.findByIdAndDelete(_id)
}

// update existing
export const updateProduct = (_id, product) => {
  return ProductSchema.findByIdAndUpdate(_id, product)
}
