import express from 'express'
const Router = express.Router()
import multer from 'multer'
import slugify from 'slugify'

import {
  addProduct,
  getAllProducts,
  getAProductBySlug,
  deleteAProduct,
  updateProduct,
} from '../models/product/Product.model.js'
import {
  newProductValidation,
  updateProductValidation,
} from '../middlewares/productFormValidation.middleware.js'

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

// CONFIGURE MULTER FOR VALIDATION AND UPLOAD DESTINATION
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let error = null
    // validation test

    cb(error, 'public/images/products')
  },
  filename: function (req, file, cb) {
    const fileNameArg = file.originalname.split('.')
    const fileName = slugify(fileNameArg[0], { lower: true })

    const fullFileName = fileName + '-' + Date.now() + '.' + fileNameArg[1]
    cb(null, fullFileName)
  },
})

const upload = multer({ storage })

//ADD NEW PRODUCT
Router.post(
  '/',
  upload.array('images', 5),
  newProductValidation,
  async (req, res) => {
    try {
      console.log(req.body)

      //FILE ZONE

      const files = req.files

      const images = []

      const basePath = `${req.protocol}://${req.get('host')}/images/products/`
      files.map((file) => {
        const imgFullPath = basePath + file.filename
        images.push(imgFullPath)
      })
      //
      const slug = slugify(req.body.title, { lower: true })
      const product = await addProduct({ ...req.body, slug, images })

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
  },
)

// DELETE A PRODUCT
Router.delete('/:_id', async (req, res) => {
  try {
    const { _id } = req.params
    if (_id) {
      const result = await deleteAProduct(_id)
      if (result?._id) {
        return res.json({
          status: 'Success',
          message: 'The product has been deleted successfully!',
        })
      }
    }
    res.json({
      status: 'Error',
      message: 'Invalid request. Product not found.',
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
Router.put(
  '/',
  upload.array('images', 5),
  updateProductValidation,
  async (req, res) => {
    try {
      const { existingImages, imgToDelete, _id, ...product } = req.body
      //FILE ZONE

      const files = req.files

      let images = []

      const basePath = `${req.protocol}://${req.get('host')}/images/products/`

      /// remove the image that is to be deleted
      images = existingImages.filter((source) => !imgToDelete.includes(source))

      console.log(req.body)
      //new image coming
      files.map((file) => {
        const imgFullPath = basePath + file.filename
        images.push(imgFullPath)
      })

      const result = await updateProduct(_id, { ...product, images })

      result?._id
        ? res.json({
            status: 'success',
            message: 'Product has been successfully updated',
          })
        : res.json({
            status: 'error',
            message: 'Unable to update the product. Please try again later.',
          })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
  },
)

export default Router
