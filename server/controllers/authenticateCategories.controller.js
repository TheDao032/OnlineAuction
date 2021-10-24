const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, async (req, res) => {
	const { cateName } = req.body

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format("YYYY-MM-DD HH:mm:ss")
	const newFatherCate = {
		cate_name: cateName,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await categoriesModel.create(newFatherCate)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-child', categoriesValidation.newCategoryChild, async (req, res) => {
	const { cateName, cateFather } = req.body

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

	const fatherInfo = await categoriesModel.findById(cateFather)

	if (fatherInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Category Father Id`,
			statusCode: errorCode
		})
	}

	if (fatherInfo[0].cate_father !== null) {
		return res.status(400).json({
			errorMessage: `Can't Set Sub-Category To Be Category Father`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format("YYYY-MM-DD HH:mm:ss")
	const cateInfo = {
		cate_name: cateName,
		cate_father: cateFather,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await categoriesModel.create(cateInfo)
	
	return res.status(200).json({
		statusCode: successCode
	})
})
