import CategorySchema from './Category.schema.js'

export const addCategory = (newCat) => {
  try {
    const result = CategorySchema(newCat).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

//get all category from db

export const getAllCats = () => {
  return CategorySchema.find()
}

export const getACat = (_id) => {
  return CategorySchema.findById(_id)
}

// delete category from db
export const deleteACat = (_id) => {
  return CategorySchema.findByIdAndDelete(_id)
}

// update existing
export const updateACat = ({ _id, ...rest }) => {
  return CategorySchema.findByIdAndUpdate(_id, rest, { new: true })
}
