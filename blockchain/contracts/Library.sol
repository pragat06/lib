// File: blockchain/contracts/Library.sol
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Library is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _loanIds;

    // The fee is set to 0.01 BNB (represented as ether)
    uint256 public constant BORROW_FEE = 0.01 ether;

    mapping(uint256 => address) public borrowedBy;

    event BookBorrowed(uint256 indexed loanId, uint256 indexed bookId, address indexed borrower, uint256 dueDate);
    event BookReturned(uint256 indexed bookId, address indexed borrower);

    // The function is 'payable' and checks the fee
    function borrowBook(uint256 bookId) public payable {
        require(msg.value == BORROW_FEE, "Incorrect borrow fee provided.");
        require(borrowedBy[bookId] == address(0), "Book is currently unavailable.");

        borrowedBy[bookId] = msg.sender;
        _loanIds.increment();
        uint256 newLoanId = _loanIds.current();
        uint256 dueDate = block.timestamp + 14 days;
        emit BookBorrowed(newLoanId, bookId, msg.sender, dueDate);
    }

    function returnBook(uint256 bookId) public {
        require(borrowedBy[bookId] != address(0), "This book was not borrowed.");
        require(borrowedBy[bookId] == msg.sender, "You are not the borrower of this book.");
        borrowedBy[bookId] = address(0);
        emit BookReturned(bookId, msg.sender);
    }
    
    function withdrawFees() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed.");
    }
}