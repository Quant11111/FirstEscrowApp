//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "hardhat/console.sol";

contract Escrow {

    address constant sinaps = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC ;

    enum State {AWAITING_PAYMENT, AWAITING_DELIVERY}
    

    struct offre{
        address payable prestataire ;
        uint payment ;
        State currentState ;
    }

    mapping (address => offre) Accord ;
   
//constructeur définissant l'adresse admin    

    constructor(){
    }

//fonction de stockage du payment (verrouillage d'une offre liée à l'adresse du msg.sender)
//l'offre est liée au msg.sender grace au mapping et enregistre l'adresse du prestataire, 
//la somme verrouillée ainsi que l'état d'avancement de l'accord

    function confirmPayment(address payable _prestataire) public payable {
        require(Accord[msg.sender].currentState == State.AWAITING_PAYMENT);
        require(Accord[msg.sender].payment == 0);
        Accord[msg.sender].payment += msg.value;
        Accord[msg.sender].prestataire = _prestataire ;
        Accord[msg.sender].currentState = State.AWAITING_DELIVERY;

    }


//getter de la valeur de payment en attente 
//seul le prestataire peut consulter le paiment en attente du buyer

    function getPaymentValue(address _buyer) external view returns(uint) {
        require(msg.sender == Accord[_buyer].prestataire);
        return Accord[_buyer].payment ;
    }

//Fonctions de transfert 
    //déverrouillage du paiment par le buyer
    function confirmDeliver() public{
        require(Accord[msg.sender].currentState == State.AWAITING_DELIVERY);
        uint _amount = Accord[msg.sender].payment;
        Accord[msg.sender].payment -= _amount;
        Accord[msg.sender].prestataire.transfer(_amount);
        Accord[msg.sender].currentState = State.AWAITING_PAYMENT ;
    }

    //déverouillage du paiement d'un buyer par sinaps
    function sinapsConfirmDeliver(address payable _buyer) public{
        require(msg.sender == sinaps);
        require(Accord[_buyer].currentState == State.AWAITING_DELIVERY);
        uint _amount = Accord[_buyer].payment;
        Accord[_buyer].payment -= _amount;
        Accord[_buyer].prestataire.transfer(_amount);
        Accord[_buyer].currentState = State.AWAITING_PAYMENT ;

    }

    //remboursement d'un buyer par sinaps
    function refound(address payable _buyer) public{
        require(msg.sender == sinaps);
        require(Accord[_buyer].currentState == State.AWAITING_DELIVERY);
        uint _amount = Accord[_buyer].payment;
        _buyer.transfer(_amount);
        Accord[_buyer].payment -= _amount;
        Accord[_buyer].currentState = State.AWAITING_PAYMENT ;
    }

}