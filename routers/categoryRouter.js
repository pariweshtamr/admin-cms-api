import express from 'express'
const Router = express.Router()
import slugify from 'slugify'
import {
  addCategory,
  getAllCats,
  getACat,
  deleteACat,
  updateACat,
} from '../models/category/Category.model.js'
import {
  newCategoryValidation,
  updateCategoryValidation,
} from '../middlewares/formValidation.middleware.js'

Router.all('/', (req, res, next) => {
  next()
})
//return all or single categories
Router.get('/:_id?', async (req, res) => {
  try {
    const { _id } = req.params
    let result
    if (_id) {
      result = await getACat(_id)
    } else {
      result = await getAllCats()
    }
    res.json({
      status: 'success',
      message: 'All the categories',
      categories: result || [],
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'error',
      message: error.message,
    })
  }
})

// Create new category
Router.post('/', newCategoryValidation, async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true })

    req.body.parentCat = req.body.parentCat ? req.body.parentCat : null

    const result = await addCategory({ ...req.body, slug })

    const status = result?._id ? 'success' : 'error'

    const message = result?._id
      ? 'Category has been created successfully'
      : 'Unable to create the category. Please try again later'

    res.send({ status, message })
  } catch (error) {
    console.log(error)

    let msg =
      'Error, unable to add new category at the moment. Please try again later'

    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'Error, the category already exists'
    }

    res.send({
      status: 'error',
      message: msg,
    })
  }
})

//delete category
Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params

    const result = await deleteACat(_id)

    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The category has been deleted successfully!',
      })
    }
    res.json({
      status: 'Error',
      message: 'Invalid requests',
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: 'error',
      message: 'Error, unable to delete category',
    })
  }
})

//update category
Router.patch('/', updateCategoryValidation, async (req, res) => {
  try {
    //update db
    const result = await updateACat(req.body)
    console.log(result)
    if (result?._id) {
      return res.json({
        status: 'success',
        message: 'The category has been updated successfully!',
      })
    }
    res.json({
      status: 'Error',
      message: 'Unable to update the category. Please try again later.',
    })
  } catch (error) {
    console.log(error)
    res.send({
      status: 'error',
      message: 'Error, unable to update category',
    })
  }
})

export default Router
