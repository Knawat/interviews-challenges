const path = require('path');
const DbService = require('moleculer-db');
const mkdir = require('mkdirp').sync;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports= (collection)=>{
console.log(process.env.MONGO_URI);
if(process.env.MONGO_URI){
	const MongoAdapter = require('moleculer-db-adapter-mongo');
	return {
		mixins:[DbService],
		adapter:new MongoAdapter(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true}),
		collection
	}

	
}

mkdir(path.resolve('./data'))

return {
	mixins: [DbService],
	adapter: new DbService.MemoryAdapter({ filename: `./data/${collection}.db` }),

	methods: {
		async entityChanged(type, json, ctx) {
			await this.clearCache();
			const eventName = `${this.name}.entity.${type}`;
			this.broker.emit(eventName, { meta: ctx.meta, entity: json });
		}
	}
};
}