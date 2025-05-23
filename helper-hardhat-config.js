developmentChains = ["hardhat", "local"];
const networkConfig = {
  11155111: {
    name: "sepolia",
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    companionChainSelector: "13116810400804392105", // saigon
  },
  // 80002: {
  //   name: "amoy",
  //   router: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
  //   linkToken: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
  //   companionChainSelector: "16281711391670634445"
  // },
  2021: {
    name: "saigon",
    router: "0x0aCAe4e51D3DA12Dd3F45A66e8b660f740e6b820",
    linkToken: "0x5bB50A6888ee6a67E22afFDFD9513be7740F1c15",
    companionChainSelector: "16015286601757825753", // sepolia
  }
}

module.exports = {
  developmentChains,
  networkConfig
}