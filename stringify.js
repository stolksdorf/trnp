const stringify = (data, depth=0)=>{
	if(Array.isArray(data)){
		return data.map((val, idx)=>{
			return `${' '.repeat(idx==0?0:depth)}- ${stringify(val, depth+2)}`;
		}).join('\n');
	}
	if(typeof data === 'object'){
		return Object.entries(data).map(([key, val], idx)=>{
			return `${' '.repeat(idx==0?0:depth)}${key}: ${stringify(val, depth+key.length+2)}`;
		}).join('\n');
	}
	if(typeof data === 'string'){
		return data.split('\n').map((line, idx)=>{
			return `${' '.repeat(idx==0?0:depth)}${line}`;
		}).join('\n');
	}
	return data.toString();
};
module.exports = stringify;