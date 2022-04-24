const FlightSuretyApp = artifacts.require("flightSuretyApp");
const FlightSuretyData = artifacts.require("flightSuretyData");

module.exports = function(deployer) {

  // deployer.deploy(FlightSuretyData)
  // deployer.deploy(FlightSuretyApp, FlightSuretyData.address)

  let firstAirline = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
  deployer.deploy(FlightSuretyData)
  .then(() => deployer.deploy(FlightSuretyApp,FlightSuretyData.address)
              // .then(() => {
              //     let config = {
              //         localhost: {
              //             url: 'http://localhost:8545',
              //             dataAddress: FlightSuretyData.address,
              //             appAddress: FlightSuretyApp.address
              //         }
              //     }
              //     // fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
              //     // fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
              // });
  );
}