const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment')

const imageproductValidation = require('../middlewares/validation/image.validate')

const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')
const productImagesModel = require('../models/productImage.model')
const productDescriptionModel = require('../models/productDescription.model')
const auctionModel = require('../models/auction.model')
const auctionStatusModel = require('../models/auctionStatus.model')
const auctionPermissionModel = require('../models/auctionPermission.model')
const accountModel = require('../models/account.model')
const commentModel = require('../models/comment.model')
const watchModel = require('../models/watch.model')

const sellerValidation = require('../middlewares/validation/seller.validate')
const productValidation = require('../middlewares/validation/product.validate')
const auctionValidation = require('../middlewares/validation/auction.validate')

const mailService = require('../services/mailService')
const mailOptions = require('../template/mailOptions')

const successCode = 0
const errorCode = 1

router.post('/add-product', sellerValidation.newProduct, async (req, res) => {

	const { prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice, prodDescription, prodExpired, prodImage } = req.body
	const { accId } = req.account

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

	const expireDate = moment(new Date(moment().year(), moment().month(), moment().date() + prodExpired, moment().hour(), moment().minute(), moment().second())).format('YYYY-MM-DD HH:mm:ss')

	const convertBegin = parseFloat(prodBeginPrice)

	const newProd = {
		prod_name: prodName,
		prod_cate_id: prodCateId,
		prod_acc_id: accId,
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

	if (prodImage) {
		if (prodImage.length > 4) {
			return res.status(400).json({
				errorMessage: `Maximum Image Is 4`,
				statusCode: errorCode
			})
		}

		// let checkValidImage = imageproductValidation.validateValidImage(prodImage.image)

		// if (!checkValidImage) {
		// 	return res.status(400).json({
		// 		errorMessage: `Product's Images Type Is Invalid Or Product's Images Files Is Bigger Than 5`,
		// 		statusCode: errorCode
		// 	})
		// }

		for (let i = 0; i < prodImage.length; i++) {
			const newProdImage = {
				prod_img_product_id: returnInfo[0],
				prod_img_src: prodImage[i].src
			}
	
			await productImagesModel.create(newProdImage)
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

router.post('/update-product', sellerValidation.updateProduct, async (req, res) => {
	const { prodId, prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice, prodExpired } = req.body

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const expireDate = moment(new Date(moment().year(), moment().month(), moment().date() + prodExpired, moment().hour(), moment().minute(), moment().second())).format('YYYY-MM-DD HH:mm:ss')
	let updateProd = {}

	updateProd.prod_updated_date = presentDate
	updateProd.prod_expired_date = expireDate

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
		if (parseFloat(prodBeginPrice) < 0) {
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
		if (parseFloat(prodStepPrice) < 1) {
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
		if (parseFloat(prodBuyPrice) < 1) {
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

	// if (prodDescription && prodDescription !== '') {
	// 	const updateProdDescription = {
	// 		prod_desc_prod_id: prodId,
	// 		prod_desc_content: prodDescription,
	// 		prod_desc_created_date: presentDate,
	// 		prod_desc_updated_date: presentDate
	// 	}

	// 	await productDescriptionModel.create(updateProdDescription)
	// }

	
	await productModel.update(updateProd, prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-image', sellerValidation.updateImage, async (req, res) => {
	const { prodId, prodImage, prodImageDel } = req.body

	allProdImages = await productImagesModel.findAll()
	
	if (!prodImage || prodImage.length === 0) {
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

	const filterDelImg = checkExistProdImage.filter((item) => {
		for (let i = 0; i < prodImageDel.length; i++) {
			if (prodImageDel[i].prodImgId === item.prod_img_id) {
				return false
			}
		}
		return true
	})

	if (filterDelImg.length + prodImage.length > 4) {
		return res.status(400).json({
			errorMessage: `Already Have ${checkExistProdImage.length} Image, Maximum Image Is 4`,
			statusCode: errorCode
		})
	}

	if (prodImageDel && prodImageDel.length !== 0) {
		for (let i = 0; i < prodImageDel.length; i++) {
			let checkExistProdImage = allProdImages.find((item) => item.prod_img_id === prodImageDel[i].prodImgId)
	
			if (checkExistProdImage) {
				await productImagesModel.delById(checkExistProdImage.prod_img_id)
			}
		}
	}

	// const checkValidImage = imageproductValidation.validateValidImage(prodImage.image)
	
	// if (!checkValidImage) {
	// 	return res.status(400).json({
	// 		errorMessage: `Product's Image Isn't Right Type`,
	// 		statusCode: errorCode
	// 	})
	// }

	for (let i = 0; i < prodImage.length; i++) {
		const prodImageInfo = {
			prod_img_product_id: prodId,
			prod_img_src: prodImage[i].src
		}
	
		await productImagesModel.create(prodImageInfo)
	}

	return res.status(200).json({
		statusCode: successCode
	})
})

// router.post('/add-image', sellerValidation.addImage, async (req, res) => {
// 	const { prodId, prodImage } = req.body

// 	if (!prodImage || prodImage.length === 0) {
// 		return res.status(400).json({
// 			errorMessage: `Image Is Required`,
// 			statusCode: errorCode
// 		})
// 	}

// 	const checkExistProd = await productModel.findById(prodId)

// 	if (checkExistProd.length === 0) {
// 		return res.status(400).json({
// 			errorMessage: `Product Doesn't Exist`,
// 			statusCode: errorCode
// 		})
// 	}

// 	const checkExistProdImage = await productImagesModel.findByProdId(prodId)

// 	if ((checkExistProdImage.length + prodImage.length) > 4) {
// 		return res.status(400).json({
// 			errorMessage: `Already Have ${checkExistProdImage.length} Image, Maximum Image Is 4`,
// 			statusCode: errorCode
// 		})
// 	}

// 	// const checkValidImage = imageproductValidation.validateValidImage(prodImage.image)
	
// 	// if (!checkValidImage) {
// 	// 	return res.status(400).json({
// 	// 		errorMessage: `Product's Image Isn't Right Type`,
// 	// 		statusCode: errorCode
// 	// 	})
// 	// }

// 	for (let i = 0; i < prodImage.length; i++) {
// 		const newProdImage = {
// 			prod_img_product_id: prodId,
// 			prod_img_src: prodImage[i].src
// 		}

// 		await productImagesModel.create(newProdImage)
// 	}
	
// 	return res.status(200).json({
// 		statusCode: successCode
// 	})
// })

router.post('/update-description', sellerValidation.updateDescription, async (req, res) => {
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

// router.post('/ban-bidder', sellerValidation.banBidder, async (req, res) => {
// 	const { bidderId, prodId } = req.body

// 	const checkExist = await auctionStatusModel.findByBidderAndProduct(bidderId, prodId)

// 	if (checkExist.length === 0) {
// 		return res.status(400).json({
// 			errorMessage: `Invalid Product Id Or Account Id`,
// 			statusCode: errorCode
// 		})
// 	}

// 	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

// 	const updateAuctionStatus = {
// 		stt_is_banned: 1,
// 		stt_updated_date: presentDate
// 	}

// 	await productDescriptionModel.update(checkExist[0].stt_id, updateAuctionStatus)
// })

router.get('/my-product', productValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query

    const { accId } = req.account

    const prodDescription = await productDescriptionModel.findAll()
    const prodImages = await productImagesModel.findAll()
	const listProduct = await productModel.findByAccId(accId)
	const listBidder = await auctionStatusModel.findAll()
	const allAccount = await accountModel.findAll()

    const convertListProduct = listProduct.map((element) => {
        const prodImageInfo = prodImages.filter((item) => item.prod_img_product_id === element.prod_id).map((info) => {
            return {
                prodImgId: info.prod_img_id,
                prodImgProductId: info.prod_img_product_id,
                prodImgSrc: info.prod_img_src
            }
        })

        const prodDescriptionOfItem = prodDescription.filter((item) => item.prod_desc_prod_id === element.prod_id).map((info) => {
            return {
                prodDescId: info.prod_desc_id,
                prodDescContent: info.prod_desc_content
            }
        })

		const biggestBidder = listBidder.find((item) => item.stt_is_biggest === 0 && item.stt_prod_id === element.prod_id)

		if (biggestBidder) {
			const accountInfo = allAccount.filter((item) => item.acc_id === biggestBidder.stt_bidder_id).map((item) => {
				return {
					accId: item.acc_id,
					accName: item.acc_full_name,
					accEmail: item.acc_email
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
				biggestBidder: accountInfo[0] || null,
				prodDescription: prodDescriptionOfItem || [],
				createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
				expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
			}
		}

        return {
            prodId: element.prod_id,
            prodName: element.prod_name,
            prodCateId: element.prod_cate_id,
            prodOfferNumber: element.prod_offer_number,
            prodBeginPrice: element.prod_begin_price,
            prodStepPrice: element.prod_step_price,
            prodBuyPrice: element.prod_buy_price,
            prodImages: prodImageInfo || [],
			biggestBidder: null,
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

router.get('/list-bought-product', productValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query
    const { accId } = req.account

    const prodDescription = await productDescriptionModel.findAll()
    const prodImages = await productImagesModel.findAll()
    const auctionList = await auctionStatusModel.findBySellerId(accId)
	const listProduct = await productModel.findAll()

    var convertListProduct = listProduct.map((element) => {
        const prodImageInfo = prodImages.filter((item) => item.prod_img_product_id === element.prod_id).map((info) => {
            return {
                prodImgId: info.prod_img_id,
                prodImgProductId: info.prod_img_product_id,
                prodImgSrc: info.prod_img_src
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

router.post('/delete-product', sellerValidation.deleteProduct, async (req, res) => {
	const { prodId } = req.body
	const checkExist = await productModel.findById(prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	await productImagesModel.delByProdId(prodId)

	await productDescriptionModel.del(prodId)

	await watchModel.delByProdId(prodId)

	await productModel.del(prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/give-permission', sellerValidation.givePermission, async (req, res) => {
	const { bidderId, prodId } = req.body
	
	const permissionInfo = await auctionPermissionModel.findByBidderAndProduct(bidderId, prodId)

	if (permissionInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id Or Bidder Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const updatePermission = {
		per_can_auction: 0,
		per_updated_date: presentDate
	}

	await auctionPermissionModel.update(permissionInfo[0].per_id, updatePermission)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/take-permission', sellerValidation.takePermission, async (req, res) => {
	const { bidderId, prodId } = req.body
	
	const permissionInfo = await auctionPermissionModel.findByBidderAndProduct(bidderId, prodId)
	const bidderAuctionInfo = await auctionStatusModel.findByBidderAndProduct(bidderId, prodId)
	const statusBidderList = await auctionStatusModel.findByProdId(prodId)
	const accountInfo = await accountModel.findById(bidderId)
	const productInfo = await productModel.findById(prodId)

	const checkBiggest = bidderAuctionInfo.find((item) => item.stt_is_biggest === 0)
	const sortByNotBiggestPrice = statusBidderList.sort((a, b) => b.stt_biggest_price - a.stt_biggest_price).filter((item) => item.stt_is_biggest === 1 && item.stt_bidder_id !== bidderId)

	if (permissionInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id Or Bidder Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const updatePermission = {
		per_can_auction: -1,
		per_updated_date: presentDate
	}

	await auctionPermissionModel.update(permissionInfo[0].per_id, updatePermission)
	
	if (checkBiggest) {

		let updateStatus = {
			stt_is_biggest: 1,
			stt_updated_date: presentDate
		}

		await auctionStatusModel.update(checkBiggest.stt_id, updateStatus)

		updateStatus = {
			stt_is_biggest: 0,
			stt_updated_date: presentDate
		}

		await auctionStatusModel.update(sortByNotBiggestPrice[0].stt_id, updateStatus)
	}

	await mailService.sendMail(mailOptions.takePermissionOptions(accountInfo[0].acc_email, accountInfo[0].acc_email, productInfo[0].prod_name), req, res)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/list-permission', sellerValidation.listPermission, async (req, res) => {
	const { prodId } = req.body
	const { accId } = req.account
	const { page, limit } = req.query
	
	const prodInfo = await productModel.findBySellerAndProduct(accId, prodId)

	if (prodInfo.length === 0) {
		return res.status(200).json({
			errorMessage: `Product Is Not Belong To Seller`,
			statusCode: errorCode
		})
	}
	const listPermissionInfo = await auctionPermissionModel.findBySellerAndProduct(accId, prodId)
	const allAccount = await accountModel.findAll()


	const convertListPermission = listPermissionInfo.map((element) => {
		const bidderInfo = allAccount.find((item) => item.acc_id === element.per_bidder_id)
		return {
			perBidderId: element.per_bidder_id,
			perBidderName: bidderInfo.acc_full_name || '',
			perBidderEmail: bidderInfo.acc_email,
			perCanAuction: element.per_can_auction,
		}
	})

	if (convertListPermission) {
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertListPermission.length / parseInt(limit))

			if (convertListPermission.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertListPermission.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listPermission: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listPermission: convertListPermission,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listPermission: [],
		statusCode: errorCode
	})
})

router.post('/cancel-bidder', sellerValidation.cancel, async (req, res) => {
	const { prodId, bidderId } = req.body
	const { accId } = req.account

	const checkBidderAuctionExist = await auctionStatusModel.findByBidderAndProduct(bidderId, prodId)

	const checkPermission = await auctionPermissionModel.findByBidderAndProduct(bidderId, prodId)

	const productInfo = await productModel.findById(prodId)
	const checkBiggest = checkBidderAuctionExist.find((item) => item.stt_is_biggest === 0)
	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	if (moment(productInfo[0].prod_expired_date) > moment()) {
		return res.status(400).json({
			errorMessage: `This Product Still Not Expired`,
			statusCode: errorCode
		})
	}

	if (!checkBiggest) {
		return res.status(400).json({
			errorMessage: `This Bidder Isn't The Winner`,
			statusCode: errorCode
		})
	}
	
	if (checkPermission.length !== 0) {
		const permissionStatusInfo = {
			per_is_cancel: 0,
			per_updated_date: presentDate 
		}

		await auctionPermissionModel.update(checkPermission[0].per_id, permissionStatusInfo)
	} else {
		const auctionStatusInfo = {
			per_seller_id: accId,
			per_bidder_id: bidderId,
			per_prod_id: prodId,
			per_is_cancel: 0,
			per_created_date: presentDate,
			per_updated_date: presentDate 
		}
	
		await auctionStatusModel.create(auctionStatusInfo)
	}

	const commentInfo = {
		cmt_to_id: accId,
		cmt_from_id: bidderId,
		cmt_vote: -1,
		cmt_content: 'Kh??ch H??ng Kh??ng Thanh To??n',
		cmt_created_date: presentDate,
		cmt_updated_date: presentDate
	}

	await commentModel.create(commentInfo)

	return res.status(200).json({
		statusCode: successCode
	})

})

module.exports = router