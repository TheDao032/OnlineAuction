const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')

const errorCode = 1
const successCode = 0

router.get('/list', categoriesValidation.paramsInfo, async (req, res) => {
	const { page, limit } = req.query

	const allCategories = await categoriesModel.findAll()
	const listCategoriesFather = await categoriesModel.findFather()

	const result = await Promise.all([
		listCategoriesFather.map((item) => {
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_id)

			if (listChild) {
				return {
					cateId: item.cate_id,
					cateName: item.cate_name,
					createDate: item.cate_created_date,
					updateDate: item.cate_updated_date,
					subCategories: listChild.map((itemChild) => {	
						return {
							cateId: itemChild.cate_id,
							cateName: itemChild.cate_name,
							createDate: itemChild.cate_created_date,
							updateDate: itemChild.cate_updated_date
						}
					})
				}
			}
		})
	])
	
	if (result.length !== 0) {
		result[0].sort((a, b) => a - b)

		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listCategories: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listCategories: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		paginationResult: {},
		statusCode: errorCode
	})
})
