export const FETCH_TOKENS = `
query MyQuery($standard_eq: String!="drc-20") {
    tokens (orderBy: timestamp_ASC, where:{standard_eq: $standard_eq}) {
      holders
      blockNumber
      id
      limit
      network
      standard
      remark
      ticker
      logo
      timestamp
      totalSales
      totalSupply
      circulatingSupply
      owner {
        address
        id
      }
      transactions
    }
  }
`;

export const GET_TOKENS = `
query GET_TOKENS($orderBy: [TokensOrderByInput!] = timestamp_ASC, $limit: Int = 10, $offset: Int = 0, $ticker:String, $standard_eq: String!="drc-20") {
  tokens(orderBy: $orderBy, limit: $limit, offset: $offset, where: {ticker_contains: $ticker, standard_eq: $standard_eq}) {
    holders
    blockNumber
    id
    limit
    network
    standard
    remark
    ticker
    timestamp
    logo
    totalSales
    totalSupply
    circulatingSupply
    owner {
      address
      id
    }
    transactions
  }
  tokensConnection(orderBy: id_ASC, where: {ticker_contains: $ticker, standard_eq: $standard_eq}) {
    totalCount
  }
}
`;

export const GET_TOKENS_FOR_MARKETPLACE = `
query GET_TOKENS_FOR_MARKETPLACE($orderBy: [TokensOrderByInput!] = timestamp_ASC, $limit: Int = 10, $offset: Int = 0, $standard_eq: String!="drc-20") {
  tokens(orderBy: $orderBy, limit: $limit, offset: $offset, where: {listed_gt: 0, standard_eq: $standard_eq}) {
    holders
    blockNumber
    id
    limit
    network
    standard
    remark
    ticker
    timestamp
    totalSales
    totalSupply
    circulatingSupply
    owner {
      address
      id
    }
    transactions
    currDaySales
    currDayVolume
    extrinsicIndex
    floor
    marketCap
    totalVolume
    listed
    logo
  }
  tokensConnection(orderBy: id_ASC, where: {listed_gt: 0, standard_eq: $standard_eq}) {
    totalCount
  }
}
`;

export const FETCH_TOKEN = `
query MyQuery($ticker: String!="kdj", $standard_eq: String!="drc-20") {
  tokens(where: {ticker_eq: $ticker, standard_eq: $standard_eq}) {
    holders
    blockNumber
    id
    limit
    network
    standard
    remark
    ticker
    timestamp
    logo
    totalSales
    totalSupply
    circulatingSupply
    owner {
      address
      id
    }
    transactions
    currDaySales
    currDayVolume
    extrinsicIndex
    floor
    marketCap
    totalVolume
  }
}
`;

export const PERSONAL_TOKENS = `
query MyQuery($address: String!, $limit: Int = 10, $offset: Int = 0,  $standard_eq: String!="drc-20" ) {
  tokens(where: {owner: {address_eq: $address},standard_eq: $standard_eq }, limit: $limit, offset: $offset) {
    holders
    blockNumber
    id
    limit
    network
    standard
    logo
    remark
    ticker
    timestamp
    totalSales
    totalSupply
    circulatingSupply
    owner {
      address
      id
    }
    transactions
  }
  tokensConnection(orderBy: id_ASC, where: {owner: {address_eq: $address}}) {
    totalCount
  }
}
`;

export const BALANCES = `
query MyQuery($address: String!, $limit: Int = 10, $offset: Int = 0, $standard_eq: String!= "drc-20") {
  userTokenBalances(where: {address: {address_eq: $address}, token:{standard_eq: $standard_eq}},  limit: $limit, offset: $offset) {
    balance
    id
    address {
      address
    }
    token {
      ticker
      timestamp
      blockNumber
      standard
      logo
      circulatingSupply
      totalSupply
    }
  }
  userTokenBalancesConnection(orderBy: id_ASC, where: {address: {address_eq: $address}, token:{standard_eq: $standard_eq}}) {
    totalCount
  }
}
`;

export const TICKER_BALANCES = `
query MyQuery($address: String!, $limit: Int = 10, $offset: Int = 0, $ticker: String) {
  userTokenBalances(where: {address: {address_eq: $address}, token: {ticker_eq: $ticker}}, limit: $limit, offset: $offset) {
    balance
    id
    address {
      address
    }
    token {
      ticker
      timestamp
      standard
      logo
      blockNumber
      circulatingSupply
      totalSupply
    }
  }
}

`;

export const FETCH_TOKENS_LISTING = `
query GET_TOKENS_LISTING($limit: Int, $offset: Int, $ticker_eq: String, $standard_eq: String!="drc-20",  $orderBy: [ListingsOrderByInput!] = id_ASC, $id: String) {
  listings(limit: $limit, where: {token: {ticker_eq: $ticker_eq, standard_eq: $standard_eq}, status_eq: Listed, id_contains: $id}, orderBy: $orderBy, offset: $offset) {
    id
    amount
    status
    timestamp
    value
    to {
      address
    }
    extrinsicIndex
    amountPerMint
    amountPerUnit
    blockNumber
    network
    from {
      address
      id
    }
    token {
      blockNumber
      circulatingSupply
      currDaySales
      currDayVolume
      extrinsicIndex
      floor
      holders
      id
      limit
      marketCap
      owner {
        address
        id
      }
      network
      remark
      standard
      ticker
      totalSales
      timestamp
      totalSupply
      transactions
      totalVolume
      logo
    }
  }
  listingsConnection(orderBy: id_ASC, where: {token: {ticker_eq: $ticker_eq, standard_eq: $standard_eq}, status_eq: Listed, id_contains: $id}) {
    totalCount
  }
}
`;

export const FETCH_TOKEN_ACTIVITIES = `
query GET_TOKEN_ACTIVITIES($limit: Int = 10, $offset: Int = 0, $ticker_eq: String, $standard_eq: String!="drc-20") {
  activities(orderBy: timestamp_DESC, where: {token: {ticker_eq: $ticker_eq, standard_eq: $standard_eq}}, limit: $limit, offset: $offset) {
    id
    activityType
    blockNumber
    extrinsicIndex
    network
    timestamp
    transfer {
      amount
      amountPerMint
      blockNumber
      extrinsicIndex
      id
      network
      timestamp
      value
      from {
        address
        id
      }
      to {
        id
        address
      }
    }
    mint {
      balance
      blockNumber
      extrinsicIndex
      id
      network
      timestamp
      account {
        address
        id
      }
    }
    listing {
      amount
      amountPerMint
      blockNumber
      amountPerUnit
      extrinsicIndex
      id
      network
      from {
        address
        id
      }
      status
      to {
        address
      }
      timestamp
      value
    }
    token{
      ticker
      logo
      standard
    }
  }
  activitiesConnection(orderBy: id_ASC, where: {token: {ticker_eq: $ticker_eq, standard_eq: $standard_eq}}) {
    totalCount
  }
}

`;

export const FETCH_TOKEN_LISTING_BY_ADDRESS = `
query GET_TOKEN_LISTING_BY_ADDRESS($limit: Int = 10, $offset: Int = 0, $ticker: String, $standard: String! = "drc-20", $address: String) {
  listings(limit: $limit, offset: $offset, orderBy: timestamp_DESC, where: {status_eq: Listed, standard_eq: $standard, token: {ticker_eq: $ticker}, from: {address_eq: $address}}) {
    value
    timestamp
    status
    standard
    purchaseStartHash
    purchaseStartBlock
    network
    purchaseStartBlockHash
    amount
    amountPerMint
    amountPerUnit
    extrinsicIndex
    blockNumber
    from {
      address
      id
    }
    id
    to {
      address
      id
    }
    token {
      ticker
      logo
      standard
    }
  }
}
`;