# nftanvil_doh_minter
Mints Anvil Protocol NFTs

# Step by step

1) `yarn address` to get a private key and address generated. Address will be in identity.json (Keep it secret)
2) Copy the address for later
3) Place big images in `content/` folder
5) Place thumb images in `thumb/` folder (They need to have the same coresponding filenames)
6) Place metadata in your `data.json` with a structure fitting your idea. 
7) Currently the index of the `data.json` record takes one image from `content/` folder corresponding to alphabetical image index. You can change that logic.
8) Edit src/mint.js and map each data record to nft metadata record
9) Place ICP in your copied address
10) `yarn start` again will start minting one nft for each record in data.json. Start with few to make sure everything is good
11) It will mint images asynchroneously and shouldn't take more than an hour to mint 10k
12) TODO: make a function which checks if all nfts were minted and their graphics uploaded. Burn fails and mint the missing.
13) TODO: make a function which returns back whats left from the ICP after minting
14) TODO: make a function which generates gift links from all minted nfts

