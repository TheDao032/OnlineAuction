const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');

const imageproductValidation = require('../middlewares/validation/image.validate')

const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')
const productImagesModel = require('../models/productImage.model')
const productDescriptionModel = require('../models/productDescription.model')
const auctionModel = require('../models/auction.model')

const productValidation = require('../middlewares/validation/product.validate')
const auctionValidation = require('../middlewares/validation/auction.validate')

const successCode = 0
const errorCode = 1

router.post('/add', productValidation.newProduct, async (req, res) => {

	const { prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice, prodDescription } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodImage.image ? true : false
	}

	const convertStep = parseFloat(prodStepPrice)

	if (convertStep < 0 ) {
		return res.status(400).json({
			errorMessage: `Product Step Price Can't Smaller Than 0`,
			statusCode: errorCode
		})
	}

	if (prodBuyPrice) {
		const convertBuy = parseFloat(prodBuyPrice)
		if (convertBuy < 1) {
			return res.status(400).json({
				errorMessage: `Product Buy Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
	}
	
	const listProdInfo = await productModel.findAll()

	const checkExistProd = listProdInfo.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_cate_id === parseInt(prodCateId)))

	if (checkExistProd) {
		return res.status(400).json({
			errorMessage: `Product's Name Has Already Existed`,
			statusCode: errorCode
		})
	}

	const cateInfo = await categoriesModel.findById(prodCateId)

	if (cateInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Category Is Invalid`,
			statusCode: errorCode
		})
	}

	if (cateInfo[0].cate_father === null) {
		return res.status(400).json({
			errorMessage: `Not Sub Categories`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const expireDate = moment(new Date(moment().year(), moment().month(), moment().date() + 1, moment().hour(), moment().minute(), moment().second())).format('YYYY-MM-DD HH:mm:ss')

	const convertBegin = parseFloat(prodBeginPrice)

	const newProd = {
		prod_name: prodName,
		prod_cate_id: prodCateId,
		prod_begin_price: prodBeginPrice && convertBegin > 0 ? convertBegin : 0,
		prod_step_price: convertStep,
		prod_buy_price: prodBuyPrice ? parseFloat(prodBuyPrice) : null,
		prod_created_date: presentDate,
		prod_expired_date: expireDate,
		prod_updated_date: presentDate
	}

	const returnInfo = await productModel.create(newProd)

	if (returnInfo.length === 0) {
		return res.status(500).json({
			errorMessage: `Internal Server Error`,
			statusCode: errorCode
		})
	}

	if (checkProdImage) {
		if (prodImage.image.length > 5) {
			return res.status(400).json({
				errorMessage: `Image, Maximum Image Is 5`,
				statusCode: errorCode
			})
		}

		let checkValidImage = imageproductValidation.validateValidImage(prodImage.image)

		if (!checkValidImage) {
			return res.status(400).json({
				errorMessage: `Product's Images Type Is Invalid Or Product's Images Files Is Bigger Than 5`,
				statusCode: errorCode
			})
		}

		if (prodImage.image.length === undefined) {
			const newProdImage = {
				prod_img_product_id: returnInfo[0],
				prod_img_data: prodImage.image
			}
	
			await productImagesModel.create(newProdImage)
		} else {
			for (let i = 0; i < prodImage.image.length; i++) {
				const newProdImage = {
					prod_img_product_id: returnInfo[0],
					prod_img_data: prodImage.image[i]
				}
		
				await productImagesModel.create(newProdImage)
			}
		}
	}

	const newProdDescription = {
		prod_desc_prod_id: returnInfo[0],
		prod_desc_content: prodDescription ? prodDescription : '',
		prod_desc_created_date: presentDate,
		prod_desc_updated_date: presentDate
	}

	await productDescriptionModel.create(newProdDescription)

	return res.status(200).json({
		statusCode: successCode
	})

})

router.post('/update', productValidation.updateProduct, async (req, res) => {
	const { prodId, prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice } = req.body

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	let updateProd = {}

	updateProd.prod_updated_date = presentDate

	const listProducts = await productModel.findAll()

	const checkExistProd = await productModel.findById(prodId)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	if (prodName && prodName !== '') {
		const checkExistProdName = listProducts.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_id !== prodId))

		if (checkExistProdName) {
			return res.status(400).json({
				errorMessage: `Product's Name Already Exist`,
				statusCode: errorCode
			})
		}

		updateProd.prod_name = prodName
	} else {
		updateProd.prod_name = checkExistProd[0].prod_name
	}

	if (prodBeginPrice) {
		if (parseFLoat(prodBeginPrice) < 0) {
			return res.status(400).json({
				errorMessage: `Product Begin Price Can't Smaller Than 0`,
				statusCode: errorCode
			})
		}
		updateProd.prod_begin_price = prodBeginPrice
	} else {
		updateProd.prod_begin_price = checkExistProd[0].prod_begin_price
	}

	if (prodStepPrice) {
		if (parseFLoat(prodStepPrice) < 1) {
			return res.status(400).json({
				errorMessage: `Product Step Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
		updateProd.prod_step_price = prodStepPrice
	} else {
		updateProd.prod_step_price = checkExistProd[0].prod_step_price
	}

	if (prodBuyPrice) {
		if (parseFLoat(prodBuyPrice) < 1) {
			return res.status(400).json({
				errorMessage: `Product Buy Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
		updateProd.prod_buy_price = prodBuyPrice
	} else {
		updateProd.prod_buy_price = checkExistProd[0].prod_buy_price
	}

	if (prodCateId) {
		const cateInfo = await categoriesModel.findById(prodCateId)

		if (cateInfo.length === 0) {
			return res.status(400).json({
				errorMessage: `Categogt Doesn't Exist`,
				statusCode: errorCode
			})
		}

		updateProd.prod_cate_id = prodCateId
	} else {
		updateProd.prod_cate_id = checkExistProd[0].prod_cate_id
	}

	if (prodDescription && prodDescription !== '') {
		const updateProdDescription = {
			prod_desc_prod_id: prodId,
			prod_desc_content: prodDescription,
			prod_desc_created_date: presentDate,
			prod_desc_updated_date: presentDate
		}

		await productDescriptionModel.create(updateProdDescription)
	}

	
	await productModel.update(updateProd, prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-image', productValidation.updateImage, async (req, res) => {
	const { prodId, prodImageId } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodImage.image ? true : false
	}

	if (!checkProdImage) {
		return res.status(400).json({
			errorMessage: `Image Is Required`,
			statusCode: errorCode
		})
	}

	if (prodImage.image.length !== undefined) {
		return res.status(400).json({
			errorMessage: `Too Many Images Are Selected. Please Select 1 Image`,
			statusCode: errorCode
		})
	}

	const checkExistProd = await productModel.findById(prodId)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkExistProdImage = await productImagesModel.findByIdAndProd(prodId, prodImageId)

	if (checkExistProdImage.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Image Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkValidImage = imageproductValidation.validateValidImage(prodImage.image)
	
	if (!checkValidImage) {
		return res.status(400).json({
			errorMessage: `Product's Image Isn't Right Type`,
			statusCode: errorCode
		})
	}

	const prodImageInfo = {
		prod_img_data: prodImage.image
	}

	await productImagesModel.update(prodImageId, prodImageInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-image', productValidation.addImage, async (req, res) => {
	const { prodId } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodImage.image ? true : false
	}

	if (!checkProdImage) {
		return res.status(400).json({
			errorMessage: `Image Is Required`,
			statusCode: errorCode
		})
	}

	const checkExistProd = await productModel.findById(prodId)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkExistProdImage = await productImagesModel.findByProdId(prodId)

	if ((checkExistProdImage.length + prodImage.image.length) > 5) {
		return res.status(400).json({
			errorMessage: `Already Have ${checkExistProdImage.length} Image, Maximum Image Is 5`,
			statusCode: errorCode
		})
	}

	const checkValidImage = imageproductValidation.validateValidImage(prodImage.image)
	
	if (!checkValidImage) {
		return res.status(400).json({
			errorMessage: `Product's Image Isn't Right Type`,
			statusCode: errorCode
		})
	}

	if (prodImage.image.length === undefined) {
		const newProdImage = {
			prod_img_product_id: prodId,
			prod_img_data: prodImage.image
		}

		await productImagesModel.create(newProdImage)
	} else {
		for (let i = 0; i < prodImage.image.length; i++) {
			const newProdImage = {
				prod_img_product_id: prodId,
				prod_img_data: prodImage.image[i]
			}
	
			await productImagesModel.create(newProdImage)
		}
	}
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-description', productValidation.updateDescription, async (req, res) => {
	const { prodId, prodDescription } = req.body

	const checkExist = await productModel.findById(prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const updateProdDescription = {
		prod_desc_prod_id: prodId,
		prod_desc_content: prodDescription,
		prod_desc_created_date: presentDate,
		prod_desc_updated_date: presentDate
	}

	await productDescriptionModel.create(updateProdDescription)

    return res.status(200).json({
        statusCode: successCode
    })
})

router.post('/ban-bidder', auctionValidation.banBidder, async (req, res) => {
	const { aucId } = req.body

	const checkExist = await auctionModel.findByAccAndProduct(accId, prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id Or Account Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const updateAuction = {
		auc_is_banned: 1,
		auc_updated_date: presentDate
	}

	await productDescriptionModel.update(aucId, updateAuction)
})

router.get('/my-product', productValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query

    const { accId } = req.account

    const prodDescription = await productDescriptionModel.findAll()
    const prodImages = await productImagesModel.findAll()
	const listProduct = await productModel.findByAccId(accId)

    const convertListProduct = listProduct.map((element) => {
        const prodImageInfo = prodImages.filter((item) => item.prod_img_product_id === element.prod_id).map((info) => {
            return {
                prodImgId: info.prod_img_id,
                prodImgProductId: info.prod_img_product_id,
                prodImgData: info.prod_img_data
            }
        })

        const prodDescriptionOfItem = prodDescription.filter((item) => item.prod_desc_prod_id === element.prod_id).map((info) => {
            return {
                prodDescId: info.prod_desc_id,
                prodDescContent: info.prod_desc_content
            }
        })

        return {
            prodId: element.prod_id,
            prodName: element.prod_name,
            prodCateId: element.prod_cate_id,
            prodOfferNumber: element.prod_offer_number,
            prodBeginPrice: element.prod_begin_price,
            prodStepPrice: element.prod_step_price,
            prodBuyPrice: element.prod_buy_price,
            prodImages: prodImageInfo || [],
            prodDescription: prodDescriptionOfItem || [],
            createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
            expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
        }
    })
	
	if (convertListProduct) {
        if (convertListProduct.length !== 0) {
            convertListProduct.sort((a, b) => moment(a.expireDate) - moment(b.expireDate))
        }

		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertListProduct.length / parseInt(limit))

			if (convertListProduct.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertListProduct.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listProducts: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listProducts: convertListProduct,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listProducts: [],
		statusCode: errorCode
	})
	
})

router.get('/bought-product', productValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query

    const { accId } = req.account

    const prodDescription = await productDescriptionModel.findAll()
    const prodImages = await productImagesModel.findAll()

    const auctionList = await auctionModel.findBySellerId(accId)

	const listProduct = await productModel.findAll()

    var convertListProduct = listProduct.map((element) => {
        const prodImageInfo = prodImages.filter((item) => item.prod_img_product_id === element.prod_id).map((info) => {
            return {
                prodImgId: info.prod_img_id,
                prodImgProductId: info.prod_img_product_id,
                prodImgData: info.prod_img_data
            }
        })

        const prodDescriptionOfItem = prodDescription.filter((item) => item.prod_desc_prod_id === element.prod_id).map((info) => {
            return {
                prodDescId: info.prod_desc_id,
                prodDescContent: info.prod_desc_content
            }
        })

		const checkExistInAuction = auctionList.find((item) => item.auc_prod_id === element.prod_id && item.auc_is_biggest !== null)

		if (checkExistInAuction) {
			return {
				prodId: element.prod_id,
				prodName: element.prod_name,
				prodCateId: element.prod_cate_id,
				prodOfferNumber: element.prod_offer_number,
				prodBeginPrice: element.prod_begin_price,
				prodStepPrice: element.prod_step_price,
				prodBuyPrice: element.prod_buy_price,
				prodImages: prodImageInfo || [],
				prodDescription: prodDescriptionOfItem || [],
				createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
				expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
			}
		}

        return
    })
	
	if (convertListProduct) {
		convertListProduct = convertListProduct.filter((item) => {
			if (!item) {
				return false
			}
			
			return true
		})
        if (convertListProduct.length !== 0) {
            convertListProduct.sort((a, b) => moment(a.expireDate) - moment(b.expireDate))
        }

		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertListProduct.length / parseInt(limit))

			if (convertListProduct.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertListProduct.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listProducts: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listProducts: convertListProduct,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listProducts: [],
		statusCode: errorCode
	})
	
})

router.post('/delete', async (req, res) => {
	const { prodId } = req.body
	const checkExist = await productModel.findById(prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	await productImagesModel.del(prodId)

	await productDescriptionModel.del(prodId)

	await productModel.del(prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router