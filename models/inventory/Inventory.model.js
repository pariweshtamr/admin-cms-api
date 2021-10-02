import InventorySchema from './Inventory.schema.js'

export const addProduct = (prodInfo) => {
  try {
    const result = InventorySchema(prodInfo).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

//get all inventory from db

export const getAllProducts = () => {
  return InventorySchema.find()
}

export const getAProduct = (_id) => {
  return InventorySchema.findById(_id)
}

// delete category from db
export const deleteAProduct = (_id) => {
  return InventorySchema.findByIdAndDelete(_id)
}

// update existing
export const updateAProduct = ({ _id, ...rest }) => {
  return InventorySchema.findByIdAndUpdate(_id, rest, { new: true })
}
