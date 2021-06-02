// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Shinet {

    address public owner;
    mapping(address => uint) balances;

    constructor() payable  {
        owner = msg.sender;
    }

  // Property to be rented out on Airbnb
  struct Package {
    uint256 payout; // per day price in wei (1 ether = 10^18 wei)
    uint256 shipperCollateral;
    address owner; // Owner of the package
    address shipper;
    bool isActive; // is package active
    uint status; // 0 = ready, 1 = in transit, 2 = delivered

  }

  uint256 public packageId;


  mapping(uint256 => Package) public packages;


  // This event is emitted when a new package is listed on the Dapp.
  event NewPackage (
    uint256 indexed packageId
  );

  // This event is emitted when a Package is picked up
  event NewShipping (
    uint256 indexed packageId,
    address shipper
  );

    // This event is emitted when a Package is delivered
  event NewDelivery (
    uint256 indexed packageId
  );

    function getContractBalance() public view returns(uint256) {
        return balances[address(this)];
    }

     function getMyBalance() public view returns(uint256) {
        return balances[address(msg.sender)];
    }

  function listPackage()  payable public {


    Package memory pkg = Package(msg.value, 0, msg.sender, address(0),true,0);

    // Persist `property` object to the "permanent" storage
    packages[packageId] = pkg;


    // owner will lock funds in the contract
    // _sendFunds(address(this), msg.value);
    //payable(address(this)).transfer(msg.value);
    balances[payable(address(this))] += msg.value;


    // emit an event to notify the clients
    emit NewPackage(packageId++);
  }


  function pickPackage(uint256 _pkgId) public payable {
    // Retrieve `package` object from the storage
    Package storage package = packages[_pkgId];

    // Assert that package is active
    require(
      package.isActive == true,
      "Package with this ID is not active"
    );

        package.shipper = msg.sender;
        package.shipperCollateral = msg.value;
        package.status = 1;
        package.payout +=msg.value;

  // shipper will lock collateral in the contract
    balances[payable(address(this))] += msg.value;


  // Emit an event to notify clients
    emit NewShipping(_pkgId, msg.sender);
  }


    function confirmDelivery(uint256 _pkgId) public  {
        // Retrieve `package` object from the storage
        Package storage package = packages[_pkgId];

        // Assert that package is active
        require(
          package.isActive == true,
          "Package with this ID is not active"
        );


        // _sendFunds(package.shipper, package.payout);

        balances[payable(address(this))] -= package.payout;
        payable(package.shipper).transfer(package.payout);

      // Emit an event to notify clients
        emit NewDelivery(_pkgId);
      }



  function _sendFunds (address beneficiary, uint256 value) internal {
    // address(uint160()) is a weird solidity quirk
    // Read more here: https://solidity.readthedocs.io/en/v0.5.10/050-breaking-changes.html?highlight=address%20payable#explicitness-requirements
    payable(address(beneficiary)).transfer(value);
  }


}
