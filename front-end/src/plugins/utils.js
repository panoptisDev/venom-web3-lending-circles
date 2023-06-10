import { ethers } from 'ethers'

const truncate = (fullStr, strLen) => {
	if(fullStr === undefined || !fullStr || fullStr.length <= strLen) return fullStr

	const separator = '...'

	let sepLen = separator.length
	let charsToShow = strLen - sepLen
	let frontChars = Math.ceil(charsToShow / 2)
	let backChars = Math.floor(charsToShow / 2)

	return fullStr.substr(0, frontChars) +
		separator +
		fullStr.substr(fullStr.length - backChars)
}

const fixedNumber = (fullNumber, toFixed = 5, minDecimals = 2) => {
	if(fullNumber === undefined) return undefined
	let fixedNumber =	+fullNumber.toFixed(toFixed).toString()
	const dec = String(fixedNumber).split('.')[1]
  const len = dec && dec.length > minDecimals ? dec.length : minDecimals
  return Number(fixedNumber).toFixed(len)
}

const bigToCommon = (unit, decimals = 0, fixed = 6) => {
	unit = ethers.BigNumber.from(unit)
	if(unit.lte(ethers.BigNumber.from(0)) && unit.gte(ethers.BigNumber.from(-1))) {
		unit = ethers.BigNumber.from(0)
	}
	return ethers.utils.commify((+ethers.utils.formatUnits(unit || 0, decimals || 0) || 0).toFixed(fixed))
}

const numberToCommon = (unit, fixed = 6) => {
	return ethers.utils.commify((+unit || 0).toFixed(fixed))
}

function formatLabel(labelValue, fixed = 1) {
	return Math.abs(Number(labelValue)) >= 1.0e+12
		? (Math.abs(Number(labelValue)) / 1.0e+12).toFixed(fixed) + 'T'
		: Math.abs(Number(labelValue)) >= 1.0e+9
			? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(fixed) + 'B'
			: Math.abs(Number(labelValue)) >= 1.0e+6
				? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(fixed) + 'M'
				: Math.abs(Number(labelValue)) >= 1.0e+3
					? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(fixed) + 'K'
					: (Math.abs(Number(labelValue))).toFixed(fixed)
}

function calROI(tvl, total) {
	if(total.eq(0)) return bigToCommon(0, 6, 2)
	return bigToCommon(tvl.div(total.div(1e+6)).sub(1e+6).mul(100), 6, 2)
}

function feeToCommon(fee) {
	fee = ethers.BigNumber.from(fee)
	return bigToCommon(fee.mul(1e+6).div(10), 6, 2)
}

function bigToLabel(unit, decimals, fixed = 1) {
	return formatLabel(+ethers.utils.formatUnits(unit, decimals), fixed)
}

function sortPH2L(askPrices, result) {
	result.forEach(r => {
		let id = Object.keys(askPrices).find(k => (r.id == k))
		if(id) {
			r.price = askPrices[id]
		} else {
			r.price = ethers.BigNumber.from(0)
		}
	})
	result.sort((a, b) => {
		if(ethers.BigNumber.from(a.price).gt(ethers.BigNumber.from(b.price))) return -1
		if(ethers.BigNumber.from(a.price).eq(ethers.BigNumber.from(b.price))) return 0
		return 1
	})

}

function sortPL2H(askPrices, result) {
	result.forEach(r => {
		let id = Object.keys(askPrices).find(k => (r.id == k))
		if(id) {
			r.price = askPrices[id]
		} else {
			r.price = ethers.constants.MaxInt256
		}
	})
	result.sort((a, b) => {
		if(ethers.BigNumber.from(a.price).lt(ethers.BigNumber.from(b.price))) return -1
		if(ethers.BigNumber.from(a.price).eq(ethers.BigNumber.from(b.price))) return 0
		return 1
	})
}

function sortOH2L(bidPrices, result) {
	result.forEach(r => {
		let id = Object.keys(bidPrices).find(k => (r.id == k))
		if(id) {
			r.topBid = bidPrices[id]
		} else {
			r.topBid = ethers.BigNumber.from(0)
		}
	})
	result.sort((a, b) => {
		if(ethers.BigNumber.from(a.topBid).gt(ethers.BigNumber.from(b.topBid))) return -1
		if(ethers.BigNumber.from(a.topBid).eq(ethers.BigNumber.from(b.topBid))) return 0
		return 1
	})

}

function sortOL2H(bidPrices, result) {
	result.forEach(r => {
		let id = Object.keys(bidPrices).find(k => (r.id == k))
		if(id) {
			r.topBid = bidPrices[id]
		} else {
			r.topBid = ethers.constants.MaxInt256
		}
	})
	result.sort((a, b) => {
		if(ethers.BigNumber.from(a.topBid).lt(ethers.BigNumber.from(b.topBid))) return -1
		if(ethers.BigNumber.from(a.topBid).eq(ethers.BigNumber.from(b.topBid))) return 0
		return 1
	})
}

function sortID(result) {
	result.sort((a, b) => {
		if(ethers.BigNumber.from(a.id).lt(ethers.BigNumber.from(b.id))) return -1
		if(ethers.BigNumber.from(a.id).eq(ethers.BigNumber.from(b.id))) return 0
		return 1
	})
}

function nftIpfsLink(link) {
	if(link) {
		return link.replace('ipfs://', process.env.VUE_APP_WEB3STORAGE_GATEWAY_LINK)
	}
	return link
}

function formatDate(unixTimestamp, formatDate = 'DD-MM-YYYY', formatTime = null) {
	if(!unixTimestamp) return null;
	let date = new Date(unixTimestamp)
	const Year = date.getFullYear()
	const Month = '0' + (date.getMonth() + 1)
	const Day = '0' + date.getDate()
	const Hours = date.getHours()
	const Minutes = '0' + date.getMinutes()
	const Seconds = '0' + date.getSeconds()
	
	let formattedDate = Day.slice(-2) + '-' + Month.slice(-2) + '-' + Year
	if(formatDate == 'DD Month YYYY') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = Day.slice(-2) + ' ' + MonthNames[date.getMonth()] + ' ' + Year
	}
	if(formatDate == 'DD Month') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = Day.slice(-2) + ' ' + MonthNames[date.getMonth()]
	}
	if(formatDate == 'Month YYYY') {
		const MonthNames = ['Jan.',	'Feb.',	'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
		formattedDate = MonthNames[date.getMonth()] + ' ' + Year
	}

	let formattedTime = null;
	if(formatTime == 'HH:MM:SS') {
		formattedTime = Hours + ':' + Minutes.substring(Minutes.length - 2) + ':' + Seconds.substring(Seconds.length - 2)
	}
	if(formatTime == 'HH:MM') {
		formattedTime = Hours + ':' + Minutes.substring(Minutes.length - 2)
	}

	return formattedDate + (formattedTime ? ` - ${formattedTime}` : '');
}

function nextMonth(firstDate, diff = 1) {
	const date = new Date(firstDate);
	if (date.getMonth() + diff >= 12) {
		return new Date(date.getFullYear() + parseInt(diff / 12), date.getMonth() + (diff % 12), date.getDate());
	} else {
		return new Date(date.getFullYear(), date.getMonth() + diff, date.getDate());
	}
}

function objectCleaner(obj) {
  Object.keys(obj).forEach(key => {
		if(obj[key] === '' || obj[key] === null || obj[key] === undefined) {
			delete obj[key];
		}
	})
  return obj
}


export default {
	truncate,
	fixedNumber,
	formatDate,
	nextMonth,
	objectCleaner,
	formatLabel,
	bigToLabel,
	bigToCommon,
	numberToCommon,
	calROI,
	feeToCommon,
	sortPH2L, sortPL2H, sortOH2L, sortOL2H, sortID,
	nftIpfsLink
}
