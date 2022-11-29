const trnp = (str)=>{
	const parseVal = (str='')=>{
		str = str.trim();
		if(str==='true')  return true;
		if(str==='false') return false;
		if(/^\[([^\]\n]*)\]$/.test(str)) return str.slice(1,-1).split(',').map(parseVal);
		if(/^(-?[\d|_]+(\.[\d|_]+)?)$/.test(str)) return Number(str.replace('_',''));
		return str;
	};
	let tokens = []; tokens.idx=0;
	const chunks = str
		.replace(/(\r)|(\/\*(\*(?!\/)|[^*])*\*\/)|([\s|^]\/\/[^\n]*)/gm, '')
		.matchAll(/(?<nl>\n)|(?<ws>[ \t]+)|(?<arr>- )|(?<key>[\w ]+?)[ \t]*:(?= |\t|$)|(?<val>.+)/gm);
	let idt = 0;
	for(let chunk of chunks){
		let {nl, ws, key, arr, val}=chunk.groups;
		if(key){ tokens.push({idt, key }); }
		if(arr){ tokens.push({idt, arr:true }); }
		if(val){ tokens.push({idt, val:parseVal(val) }); }
		idt = nl ? 0 : idt+chunk[0].length;
	};
	const nest = (stp=0)=>{
		let res;
		while(tokens.idx < tokens.length){
			const token = tokens[tokens.idx++];
			if(token.idt < stp){ tokens.idx--; break; }
			if(typeof res === 'undefined'){ if(token.arr){res=[];} if(token.key){res={};} }
			if(token.arr && Array.isArray(res)){ res.push(nest(token.idt+1)); continue; }
			if(token.key && typeof res === 'object'){ res[token.key] = nest(token.idt+1); continue; }
			res = (typeof res !== 'string') ? token.val : res+'\n'+token.val;
		}
		if(typeof res === 'string') res = res.replace(/^["']|["']$/gm, '');
		return res;
	}
	return nest();
};

module.exports = trnp;