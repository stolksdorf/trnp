const isGroup = (str)=>{
	if(str[0]==='-') return {key:true, val:str.substring(1), idt:1};
	const [_,key,val] = str.match(/^(\s*[a-z0-9A-Z_]+\s*):(( .*)|(\s*$))/) || [];
	if(key) return {key:key.trim(), val, idt:key.length+1};
	return false;
};
const isAtomic = (str)=>{
	if(str==='true')  return [true];
	if(str==='false') return [false];
	if(/^(-?[\d|_]+(\.[\d|_]+)?)$/.test(str)) return [Number(str.replace('_',''))];
	return false;
}
const pluckTokens = (tokens, target)=>{
	let idx = target+1;
	while(tokens[idx] && tokens[idx].idt > tokens[target].idt){ idx++; }
	return tokens.slice(target+1, idx);
};
const tokenize = (line, offset=0)=>{
	let val = line.trim(), temp;
	if(!val) return [];
	let idt = line.length - line.trimStart().length + offset;
	if(temp = isAtomic(val)) return [{val:temp[0], idt}];
	if(temp = isGroup(val)) return [{key:temp.key, idt}, ...tokenize(temp.val, temp.idt+idt)];
	return [{val, idt}];
};
const parse = (tokens)=>{
	if(tokens.length === 0) return;
	let result;
	const parseSubval = ()=>{
		const subtokens = pluckTokens(tokens, idx);
		idx += subtokens.length;
		return parse(subtokens);
	};
	let idx = 0;
	while(idx<tokens.length){
		if(tokens[idx].key===true){
			if(!Array.isArray(result)) result = [];
			result.push(parseSubval());
		}else if(tokens[idx].key){
			if(typeof result !== 'object') result = {};
			result[tokens[idx].key] = parseSubval();
		}else if(typeof result === 'string' && typeof tokens[idx].val === 'string'){
			result += '\n'+tokens[idx].val;
		}else{
			result = tokens[idx].val;
		}
		idx++;
	}
	return result;
};
module.exports = (str)=>{
	str = str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1'); //Removes all comments
	return parse(str.split('\n').reduce((acc,line)=>acc.concat(tokenize(line)), []));
};