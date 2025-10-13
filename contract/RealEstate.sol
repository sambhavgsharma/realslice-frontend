//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstate is ERC1155, Ownable(msg.sender){
    struct Property{
        uint256 id;
        uint256 totalShares;
        address owner;
        bool isListed;
    }

    mapping(uint256 => Property) public properties;
    uint256 public nextPropertyId;

    event PropertyCreated(uint256 indexed propertyId, address indexed owner, uint256 shares);
    event SharesTransferred(uint256 indexed propertyId, address indexed from, address indexed to, uint256 amount, uint256 paidAmount);
    event PropertyListen(uint256 indexed propertyId, bool listed);

    constructor() ERC1155("https://api.yourdomain.com/metadata/{id}.json"){}

    function createProperty(uint256 totalShares) external returns (uint256){
        uint256 propertyId = ++nextPropertyId;

        properties[propertyId] = Property({
            id: propertyId,
            totalShares: totalShares,
            owner: msg.sender,
            isListed: false
        });

        _mint(msg.sender, propertyId, totalShares, "");

        emit PropertyCreated(propertyId, msg.sender, totalShares);
        return propertyId;
    }

    function toggleListing(uint256 propertyId, bool status) external{
        require(properties[propertyId].owner == msg.sender, "Not property owner");
        properties[propertyId].isListed = status;
        emit PropertyListen(propertyId, status);
    }

    function transferShares(address from, address to, uint256 propertyId, uint256 amount) external payable {
        require(msg.value > 0, "No ETH sent");
        require(balanceOf(from, propertyId) >= amount, "Insufficient shares");
        
        _safeTransferFrom(from, to, propertyId, amount, "");

        (bool sent, ) = payable(from).call{value: msg.value}("");
        require(sent, "Payment failed");
        
        emit SharesTransferred(propertyId, from, to, amount, msg.value);
    }

    function burnShares(address from, uint256 propertyId, uint256 amount) external{
        require(msg.sender == from || msg.sender == owner(), "Not authorized");
        _burn(from, propertyId, amount);
    }

    function getTotalShares(uint256 propertyId) external view returns (uint256){
        return properties[propertyId].totalShares;
    }
}