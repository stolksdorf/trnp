/* A light weight version of trnp with a reduced spec, used for markdown front matter */

module.exports = (str)=>{
	str = str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
	let result = {}, lastKey;
	const get = (str)=>{
		if(str==='true')  return true;
		if(str==='false') return false;
		if(/^(-?[\d|_]+(\.[\d|_]+)?)$/.test(str)) return Number(str.replace('_',''));
		return str;
	}
	str.split('\n').map(line=>{
		const [_,key,val] = line.match(/^(\s*[a-z0-9A-Z_]+\s*):(( .*)|(\s*$))/) || [];
		if(key){ lastKey = key.trim(); line = val; }
		line = get(line.trim());
		if(line==='') return;
		if(typeof line !== 'string') return result[lastKey] = line;
		if(line[0] == '-'){
			if(!Array.isArray(result[lastKey])) result[lastKey] = [];
			return result[lastKey].push(get(line.substring(1).trim()));
		}
		result[lastKey] = (typeof result[lastKey] == 'string' ? result[lastKey]+'\n' : '') + line;
	});
	return result;
};