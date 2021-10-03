import express from 'express'
const Router = express.Router()
import slugify from 'slugify'

import {
  addProduct,
  getAllProducts,
  getAProductBySlug,
} from '../models/product/Product.model.js'
import { newProductValidation } from '../middlewares/productFormValidation.middleware.js'

Router.get('/:slug?', async (req, res) => {
  try {
    const { slug } = req.params

    const products = slug
      ? await getAProductBySlug(slug)
      : await getAllProducts()

    res.json({
      status: 'success',
      message: 'Product List',
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

//ADD NEW PRODUCT
Router.post('/', newProductValidation, async (req, res) => {
  try {
    console.log(req.body)
    const slug = slugify(req.body.title, { lower: true })
    const product = await addProduct({ ...req.body, slug })
    console.log(product)

    product?._id
      ? res.json({
          status: 'success',
          message: 'New product has been successfully added',
        })
      : res.json({
          status: 'error',
          message: 'Unable to add the product. Please try again later.',
        })
  } catch (error) {
    console.log(error)

    if (error.message.includes('E11000 duplicate key error collection')) {
      return res.json({
        status: 'error',
        message: 'Slug cannot be same as already exiting product',
      })
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

// DELETE A PRODUCT
Router.delete('/', async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'TODO, delete a product',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

// UPDATE A PRODUCT
Router.patch('/', async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'TODO, delete a product',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
})

export default Router
