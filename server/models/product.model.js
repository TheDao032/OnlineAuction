const knex = require('../utils/dbConnection')

const findById = async (prodId) => {
	const info = await knex('tbl_product')
			.where({ prod_id: prodId })

	return info
}

const findByCateId = async (cateId) => {
	const info = await knex('tbl_product')
			.where({ prod_cate_id: cateId })

	return info
}

const findAll = async () => {
	const info = await knex('tbl_product')

	return info
}

const create = async (prodInfo) => {
	const returning = await knex('tbl_product')
			.insert(prodInfo)
			.returning('prod_id')

	return returning
}

const update = async (prodInfo, prodId) => {
	await knex('tbl_product')
			.update(prodInfo)
			.where({ prod_id: prodId })
}

const del = async (prodId) => {
	await knex('tbl_product')
			.where({ prod_id: prodId })
			.del()
}

module.exports = {
	findById,
	findByCateId,
	findAll,
	create,
	update,
	del
}
