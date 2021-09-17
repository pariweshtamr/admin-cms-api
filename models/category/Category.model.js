import CategorySchema from "./Category.schema.js";

export const addCategory = newCat => {
try {
    const result = CategorySchema(newCat).save()
    return result

}   catch (error) {
    throw new Error(error)
    }
}