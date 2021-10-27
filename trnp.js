const isNumber = (val)=>/^(-?[\d|_]+(\.[\d|_]+)?)$/.test(val);
const sliceSubTokens = (tokens, targetIdx)=>{
	let targetIndent = tokens[targetIdx].indent, newIdx = targetIdx;
	while(1){
		newIdx++;
		if(!tokens[newIdx] || tokens[newIdx].indent <= targetIndent) break;
	}
	return {subtokens : tokens.slice(targetIdx+1, newIdx), newIdx: newIdx-1};
};
const clean = (str)=>{
	return str
		.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') //Removes all comments
		.split('\n')
};
const tokenize = (lines)=>{
	let result = [];
	const tokenizeLine = (line, offset=0)=>{
		let val = line.trim();
		if(!val) return;
		let indent = line.length - line.trimStart().length + offset;

		if(val==='true') return result.push({indent, val: true});
		if(val==='false') return result.push({indent, val: false});
		if(isNumber(val)) return result.push({indent, val: Number(val.replace('_',''))});
		if(val[0] == '-'){
			result.push({indent, arr:true});
			return tokenizeLine(val.slice(1), indent + 1);
		}
		const [_,key,objVal] = val.match(/^(\s*[a-z0-9A-Z_]+\s*):(.*)/) || [];
		if(key){
			result.push({indent, key:key.trim()});
			return tokenizeLine(objVal, indent + key.length + 1);
		}
		const lastToken = result[result.length-1] || {};
		if(typeof lastToken.val == 'string' && lastToken.indent == indent){
			result[result.length-1].val += '\n' + val;
		}else{
			result.push({indent, val});
		}
	}
	lines.map(line=>tokenizeLine(line))
	return result;
};

const parse = (tokens)=>{
	let result;
	for(let idx=0;idx<tokens.length;idx++){
		const token = tokens[idx];
		if(token.arr){
			if(!Array.isArray(result)) result = [];
			const {subtokens, newIdx} = sliceSubTokens(tokens, idx);
			idx = newIdx;
			result.push(parse(subtokens));
			continue;
		}
		if(token.key){
			if(typeof result !== 'object') result = {};
			const {subtokens, newIdx} = sliceSubTokens(tokens, idx);
			idx = newIdx;
			result[token.key] = parse(subtokens);
			continue;
		}
		result = token.val;
	};
	return result;
};
const weave = (a1, a2)=>a2.reduce((r,_,i)=>r.concat(a1[i],a2[i]),[]).concat(a1[a1.length-1]);
module.exports = (str, ...args)=>{
	if(Array.isArray(str)) str = weave(str,args).join('');
	return parse(tokenize(clean(str)))
};