const { ethers } = require('ethers')
const { LendingCircleContract } = require('@/contracts')
const contractAbi = LendingCircleContract.abi

class SDK {
	constructor(contractAddress, provider) {
		let signer = provider.getSigner()
		if(provider.connection.url !== 'metamask') {
			let randomWallet = ethers.Wallet.createRandom()
			signer = new ethers.Wallet(randomWallet.privateKey, provider)
		}
		this.provider = provider
		this.contractAddress = contractAddress
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
		this.address = this.contract.address
	}

	owner() {
		return this.contract.owner()
	}

	paymentToken() {
		return this.contract.paymentToken()
	}

	startDate() {
		return this.contract.startDate()
	}

	getCircleDetails() {
		return this.contract.getCircleDetails()
	}
	
	getCircleStatus() {
		return this.contract.getCircleStatus()
	}

	getWhitelist(addr) {
		return this.contract.getWhitelist(addr)
	}
	
	getMember(addr) {
		return this.contract.getMember(addr)
	}

	async setupCircle(
		circle_name,
		fixed_amount_x100,
		min_members,
		max_members,
		winners_order,
		winners_number,
		patience_benefit_x10000
	) {
		return await this.contract.setupCircle(
			circle_name,
			fixed_amount_x100,
			min_members,
			max_members,
			winners_order,
			winners_number,
			patience_benefit_x10000
		)
	}

	async launchCircle(start_date) {
		return await this.contract.launchCircle(start_date)
	}
	
	async addToWhitelist(invited_adrs) {
		return await this.contract.addToWhitelist(JSON.parse(invited_adrs))
	}
	
	async removeFromWhitelist(invited_adrs) {
		return await this.contract.removeFromWhitelist(JSON.parse(invited_adrs))
	}

	
	
	
	async batchMint(
		mintAmount,
		ownerAdr,
		names,
		descriptions,
		imgURIs,
		externalURLs,
		attributes,
		files,
		value
	) {
		return await this.contract.batchMint(
			mintAmount,
			ownerAdr,
			JSON.parse(JSON.stringify(names)),
			JSON.parse(JSON.stringify(descriptions)),
			JSON.parse(JSON.stringify(imgURIs)),
			JSON.parse(JSON.stringify(externalURLs)),
			JSON.parse(JSON.stringify(attributes)),
			JSON.parse(JSON.stringify(files)),
			value
		)
	}

	async isApprovedForAll(owner, operator) {
		return await this.contract.isApprovedForAll(owner, operator)
	}
	
	async getApproved(tokenId) {
		return await this.contract.getApproved(tokenId)
	}

	async approve(to, tokenId) {
		return await this.contract.approve(to, tokenId)
	}
	
	async setApprovalForAll(operator, approved) {
		return await this.contract.setApprovalForAll(operator, approved)
	}

	async withdraw() {
		return await this.contract.withdraw()
	}

}

module.exports = SDK
