const accountProfileContractAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"serviceAccount","type":"address"}],"outputs":[]},{"name":"updateProfile","inputs":[{"name":"fullName","type":"string"}],"outputs":[]},{"name":"getAccountProfile","inputs":[],"outputs":[{"name":"fullName","type":"string"}]},{"name":"getOwner","inputs":[],"outputs":[{"name":"value0","type":"address"}]},{"name":"withdraw","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"done","type":"bool"}]},{"name":"deleteProfile","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"done","type":"bool"}]}],"data":[{"key":1,"name":"accountsContractAddress","type":"address"},{"key":2,"name":"accountAddress","type":"address"}],"events":[{"name":"AccountProfileCreated","inputs":[{"name":"account","type":"address"},{"name":"profile","type":"address"},{"name":"createdAt","type":"uint64"}],"outputs":[]},{"name":"AccountProfileUpdated","inputs":[{"name":"fullName","type":"string"},{"name":"updatedAt","type":"uint64"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"accountsContractAddress","type":"address"},{"name":"accountAddress","type":"address"},{"name":"_serviceAccount","type":"address"},{"name":"_ownerPublicKey","type":"uint256"},{"name":"_fullName","type":"string"},{"name":"_username","type":"string"},{"name":"_createdAt","type":"uint64"},{"name":"_updatedAt","type":"uint64"}]} as const
const accountsContractAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"serviceAddress","type":"address"}],"outputs":[]},{"name":"createAccount","inputs":[{"name":"publicKey","type":"uint256"}],"outputs":[]},{"name":"setAccount","inputs":[{"name":"answerId","type":"uint32"},{"name":"accountAddress","type":"address"},{"name":"username","type":"string"},{"name":"email","type":"string"}],"outputs":[{"name":"done","type":"bool"},{"name":"err","type":"uint16"}]},{"name":"getAccount","inputs":[{"name":"accountAddress","type":"address"}],"outputs":[{"components":[{"name":"created","type":"bool"},{"name":"activated","type":"bool"},{"name":"publicKey","type":"uint256"},{"name":"username","type":"string"},{"name":"email","type":"string"},{"name":"emailVerified","type":"bool"},{"name":"profileContractAddress","type":"address"},{"name":"status","type":"string"}],"name":"account","type":"tuple"}]},{"name":"isUsenameAvailable","inputs":[{"name":"username","type":"string"}],"outputs":[{"name":"available","type":"bool"}]},{"name":"isEmailAvailable","inputs":[{"name":"email","type":"string"}],"outputs":[{"name":"available","type":"bool"}]}],"data":[{"key":1,"name":"version","type":"string"},{"key":2,"name":"accountProfileContractCode","type":"cell"}],"events":[{"name":"AccountCreated","inputs":[{"name":"account","type":"address"},{"name":"at","type":"uint64"}],"outputs":[]},{"name":"AccountProfileCreated","inputs":[{"name":"account","type":"address"},{"name":"accountProfile","type":"address"},{"name":"at","type":"uint64"}],"outputs":[]},{"name":"ErrorMessage","inputs":[{"name":"code","type":"uint16"},{"name":"message","type":"string"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"version","type":"string"},{"name":"accountProfileContractCode","type":"cell"},{"name":"_serviceAddress","type":"address"},{"name":"_ownerPublicKey","type":"uint256"},{"components":[{"name":"created","type":"bool"},{"name":"activated","type":"bool"},{"name":"publicKey","type":"uint256"},{"name":"username","type":"string"},{"name":"email","type":"string"},{"name":"emailVerified","type":"bool"},{"name":"profileContractAddress","type":"address"},{"name":"status","type":"string"}],"name":"_accounts","type":"map(address,tuple)"},{"name":"_takenUsernames","type":"optional(cell)"},{"name":"_takenEmails","type":"optional(cell)"}]} as const
const lendingCircleBaseAbi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"paymentToken","type":"address"},{"name":"roundDays","type":"uint16"},{"name":"paymentType","type":"uint8"},{"name":"creatorEarnings_x10000","type":"uint16"}],"outputs":[]},{"name":"_removeCircle","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"done","type":"bool"}]},{"name":"getCircleDetails","inputs":[],"outputs":[{"name":"owner","type":"address"},{"name":"circleName","type":"string"},{"name":"roundDays","type":"uint16"},{"name":"fixedAmount","type":"uint256"},{"name":"minMembers","type":"uint8"},{"name":"maxMembers","type":"uint8"},{"name":"startDate","type":"uint256"}]},{"name":"getCircleStatus","inputs":[],"outputs":[{"name":"status","type":"string"}]}],"data":[{"key":1,"name":"version","type":"string"},{"key":2,"name":"circleOwner","type":"address"},{"key":3,"name":"serviceAddress","type":"address"},{"key":4,"name":"nonce","type":"uint16"}],"events":[{"name":"CircleIsSet","inputs":[{"name":"circleContract","type":"address"},{"name":"cirleName","type":"string"},{"name":"circleOwner","type":"address"},{"name":"circleCreator","type":"address"}],"outputs":[]},{"name":"CircleLaunched","inputs":[{"name":"circleContract","type":"address"},{"name":"cirleName","type":"string"},{"name":"circleOwner","type":"address"},{"name":"circleCreator","type":"address"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"version","type":"string"},{"name":"circleOwner","type":"address"},{"name":"serviceAddress","type":"address"},{"name":"nonce","type":"uint16"},{"name":"_ownerPublicKey","type":"uint256"},{"name":"_circleName","type":"string"},{"name":"_creatorEarnings_x10000","type":"uint16"},{"name":"_roundDays","type":"uint16"},{"name":"_paymentType","type":"uint8"},{"name":"_fixedAmount","type":"uint256"},{"name":"_minMembers","type":"uint8"},{"name":"_maxMembers","type":"uint8"},{"name":"_winnersOrder","type":"uint8"},{"name":"_winnersNumber","type":"uint8"},{"name":"_patienceBenefit_x10000","type":"uint16"},{"name":"_circleStatus","type":"uint8"},{"name":"_paymentToken","type":"address"},{"name":"_startDate","type":"uint256"},{"name":"_roundIndex","type":"uint8"},{"name":"_maxRounds","type":"uint8"}]} as const
const lendingCircleContractA01Abi = {"ABIversion":2,"version":"2.2","header":["pubkey","time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"paymentToken","type":"address"},{"name":"roundDays","type":"uint16"},{"name":"paymentType","type":"uint8"},{"name":"creatorEarnings_x10000","type":"uint16"}],"outputs":[]},{"name":"setCircle","inputs":[{"name":"circleName","type":"string"},{"name":"fixedAmount","type":"uint256"},{"name":"minMembers","type":"uint8"},{"name":"maxMembers","type":"uint8"},{"name":"winnersOrder","type":"uint8"},{"name":"winnersNumber","type":"uint8"},{"name":"patienceBenefit_x10000","type":"uint16"}],"outputs":[]},{"name":"launchCircle","inputs":[{"name":"startDate","type":"uint256"}],"outputs":[]},{"name":"addModerator","inputs":[{"name":"accountAddress","type":"address"}],"outputs":[]},{"name":"addToWhitelist","inputs":[{"name":"listedAddress","type":"address[]"}],"outputs":[]},{"name":"removeFromWhitelist","inputs":[{"name":"delistedAddress","type":"address[]"}],"outputs":[]},{"name":"joinCircle","inputs":[{"name":"selectedRound","type":"uint8"}],"outputs":[]},{"name":"memberChangeRound","inputs":[{"name":"selectedRound","type":"uint8"}],"outputs":[]},{"name":"memberPayment","inputs":[],"outputs":[]},{"name":"getWhitelist","inputs":[{"name":"accountAddress","type":"address"}],"outputs":[{"components":[{"name":"alive","type":"bool"},{"name":"moderator","type":"address"},{"name":"joined","type":"bool"}],"name":"value0","type":"tuple"}]},{"name":"getMember","inputs":[{"name":"accountAddress","type":"address"}],"outputs":[{"components":[{"name":"alive","type":"bool"},{"name":"isModerator","type":"bool"},{"name":"selectedRound","type":"uint8"},{"name":"totalPayments","type":"uint256"},{"name":"loanAmount","type":"uint256"},{"name":"debtor","type":"bool"}],"name":"value0","type":"tuple"}]},{"name":"_removeCircle","inputs":[{"name":"answerId","type":"uint32"}],"outputs":[{"name":"done","type":"bool"}]},{"name":"getCircleDetails","inputs":[],"outputs":[{"name":"owner","type":"address"},{"name":"circleName","type":"string"},{"name":"roundDays","type":"uint16"},{"name":"fixedAmount","type":"uint256"},{"name":"minMembers","type":"uint8"},{"name":"maxMembers","type":"uint8"},{"name":"startDate","type":"uint256"}]},{"name":"getCircleStatus","inputs":[],"outputs":[{"name":"status","type":"string"}]}],"data":[{"key":1,"name":"version","type":"string"},{"key":2,"name":"circleOwner","type":"address"},{"key":3,"name":"serviceAddress","type":"address"},{"key":4,"name":"nonce","type":"uint16"}],"events":[{"name":"LogStartOfRound","inputs":[{"name":"roundIndex","type":"uint8"}],"outputs":[]},{"name":"LogEndOfCircle","inputs":[],"outputs":[]},{"name":"CircleIsSet","inputs":[{"name":"circleContract","type":"address"},{"name":"cirleName","type":"string"},{"name":"circleOwner","type":"address"},{"name":"circleCreator","type":"address"}],"outputs":[]},{"name":"CircleLaunched","inputs":[{"name":"circleContract","type":"address"},{"name":"cirleName","type":"string"},{"name":"circleOwner","type":"address"},{"name":"circleCreator","type":"address"}],"outputs":[]}],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"version","type":"string"},{"name":"circleOwner","type":"address"},{"name":"serviceAddress","type":"address"},{"name":"nonce","type":"uint16"},{"name":"_ownerPublicKey","type":"uint256"},{"name":"_circleName","type":"string"},{"name":"_creatorEarnings_x10000","type":"uint16"},{"name":"_roundDays","type":"uint16"},{"name":"_paymentType","type":"uint8"},{"name":"_fixedAmount","type":"uint256"},{"name":"_minMembers","type":"uint8"},{"name":"_maxMembers","type":"uint8"},{"name":"_winnersOrder","type":"uint8"},{"name":"_winnersNumber","type":"uint8"},{"name":"_patienceBenefit_x10000","type":"uint16"},{"name":"_circleStatus","type":"uint8"},{"name":"_paymentToken","type":"address"},{"name":"_startDate","type":"uint256"},{"name":"_roundIndex","type":"uint8"},{"name":"_maxRounds","type":"uint8"},{"components":[{"name":"alive","type":"bool"},{"name":"moderator","type":"address"},{"name":"joined","type":"bool"}],"name":"_whitelist","type":"map(address,tuple)"},{"name":"_totalWhitelisted","type":"uint8"},{"components":[{"name":"alive","type":"bool"},{"name":"isModerator","type":"bool"},{"name":"selectedRound","type":"uint8"},{"name":"totalPayments","type":"uint256"},{"name":"loanAmount","type":"uint256"},{"name":"debtor","type":"bool"}],"name":"_members","type":"map(address,tuple)"},{"name":"_totalMembers","type":"uint8"},{"name":"_selectedRounds","type":"map(uint8,address)"},{"components":[{"name":"isWon","type":"bool"},{"name":"winRound","type":"uint8"},{"name":"loanAmount","type":"uint256"}],"name":"_winners","type":"map(address,tuple)"}]} as const

export const factorySource = {
    AccountProfileContract: accountProfileContractAbi,
    AccountsContract: accountsContractAbi,
    LendingCircleBase: lendingCircleBaseAbi,
    LendingCircleContractA01: lendingCircleContractA01Abi
} as const

export type FactorySource = typeof factorySource
export type AccountProfileContractAbi = typeof accountProfileContractAbi
export type AccountsContractAbi = typeof accountsContractAbi
export type LendingCircleBaseAbi = typeof lendingCircleBaseAbi
export type LendingCircleContractA01Abi = typeof lendingCircleContractA01Abi