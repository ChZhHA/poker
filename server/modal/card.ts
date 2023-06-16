export enum CardSuit {
    Spade = "spades",
    Heart = "hearts",
    Diamond = "diamonds",
    Club = "clubs",
}

export class Card {
    constructor(public suit: CardSuit, private _rank: number) {}
    // get rank(){
    //     if(rank)
    // }
}
