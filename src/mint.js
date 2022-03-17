import {
  easyMint,
  routerCanister,
  pwrCanister,
  getMap,
  AccountIdentifier,
  PrincipalFromSlot,
  anvilCanister,
  claimBalance
} from "@vvv-interactive/nftanvil";

import {
  encodeTokenId,
  decodeTokenId,
  tokenUrl,
  ipfsTokenUrl,
  tokenToText,
  tokenFromText,
  principalToAccountIdentifier,
  getSubAccountArray,
} from "@vvv-interactive/nftanvil-tools/cjs/token.js";

import fs from "fs";

let graphics = fs.readdirSync("./content").filter(x => x.indexOf(".png") !== -1 );



const contentFile = (x) => {
	return "./content/"+graphics[x];
}
const thumbFile = (x) => {
	return "./thumb/"+graphics[x];
}

// You dont need to use fixName or fixDesc
const fixName = (n) => {
	return n.replace(/^[^a-zA-Z0-9]+/,"").replace(";",".").replace(/[^\sa-zA-Z0-9\-,\'\.\(\)]/, "");
}

const fixDesc = (n) => {
	return n.replace(/^[^a-zA-Z0-9]+/,"").replace(";",".").replace(/[^\sa-zA-Z0-9\-,\'\.\(\)]/, "");
}

const main = async () => {
  let { principal, address, subaccount } = await routerCanister();
  
  let map = await getMap();

  await claimBalance(address, subaccount); // if you sent ICP to that address it needs to be claimed

  let pwr = pwrCanister(
    PrincipalFromSlot(map.space, AccountIdentifier.TextToSlot(address, map.pwr))
  );

  let balance = await pwr.balance({
    user: { address: AccountIdentifier.TextToArray(address) },
  });

  console.log("Script address ", address);
  console.log("Balance ", balance.pwr);


  let data = JSON.parse(fs.readFileSync("./data.json"));

  data = [data[ Math.floor(Math.random()* data.length)]];

  let items = [];

	for (let i=0; i<data.length; i++) {
		let s = data[i];

		let request = {
			user: { address: AccountIdentifier.TextToArray(address) },
			subaccount: [AccountIdentifier.TextToArray(subaccount)],
			metadata: {
				domain: ["nftanvil.com/doh"], 
				name: [fixName(s.name)],
				lore: [fixDesc(s.desc)],
				quality: 1,
				secret: false,
				transfer: { unrestricted: null },
				ttl: [103680],
				content: [{
					internal: { contentType: "image/png", path: contentFile(i) },
				}],
				thumb: {
					internal: { contentType: "image/png", path: thumbFile(i) },
				},
				attributes: Object.keys(s.attr).map(x => {
					if (s.attr[x] == 0) return false;
					return [x, s.attr[x] ]
					}).filter(Boolean),
				tags: [],
				custom: [],
				customVar: [],
				authorShare: 50,
				price: { amount: 0, marketplace: [], affiliate: [] },
				rechargeable: true,
			}
		};
		items.push(request)
	}


  try {
    let resp = await easyMint(items);
	console.log("RESP", resp)
  } catch (e) {
    console.log(e);
  }
};

main();





