    let bank = 10000000;
    let bet = 10; // Default bet amount
    let playerCards = [];
    let dealerCards = [];
    let playerScore = 0;
    let dealerScore = 0;
    let gameOver = false;
    let decks = 8; // Default number of decks

    const cardValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'J': 10, 'Q': 10, 'K': 10, 'A': 11
    };
    
    let deck = [];
    function initDeck() {
        deck = [];
        for (let i = 0; i < decks; i++) {
            deck.push(...['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
        }
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCard() {
        if (deck.length === 0) {
            alert('Deck needs to be reshuffled!');
            initDeck();
            shuffleDeck();
        }
        return deck.pop();
    }

    function calculateScore(cards) {
        let score = 0;
        let aceCount = 0;
        for (let card of cards) {
            score += cardValues[card];
            if (card === 'A') {
                aceCount++;
            }
        }
        while (aceCount > 0 && score > 21) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    function updateUI() {
        document.getElementById('player-cards').innerHTML = playerCards.map(card => `<div class="card"><img src="${card}.png" alt="${card}"></div>`).join('');
        document.getElementById('player-score').textContent = `: ${playerScore}`;
        document.getElementById('dealer-cards').innerHTML = dealerCards.map(card => `<div class="card"><img src="${card}.png" alt="${card}"></div>`).join('');
        document.getElementById('dealer-score').textContent = `: ${dealerScore}`;
        document.getElementById('bank').textContent = `Bank: $${bank}`;
    }
    
    function startGame() {
        //let player enter amount of decks
        //decks = parseInt(document.getElementById('deck-input').value);
        initDeck();
        shuffleDeck();
        bet = parseInt(document.getElementById('bet-input').value);
        if (isNaN(bet) || bet < 1 || bet > bank) {
            alert('Invalid bet amount. Please enter a valid number between 1 and your current bank balance.');
            return;
        }
        bank -= bet;
        document.getElementById('bank').textContent = `Bank: $${bank}`;
        document.getElementById('bet-input').enabled = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('deal-btn').style.display = 'inline-block';
        document.getElementById('hit-btn').style.display = 'inline-block';
        document.getElementById('stand-btn').style.display = 'inline-block';
        document.getElementById('player-hand').removeChild(document.getElementById('bet-input').parentNode);
        document.getElementById('player-hand').insertAdjacentHTML('beforeend', `<h3>Bet: $${bet}</h3>`);
        deal();
    }

    function deal() {
        playerCards = [dealCard(), dealCard()];
        dealerCards = [dealCard(), dealCard()];
        playerScore = calculateScore(playerCards);
        dealerScore = calculateScore(dealerCards);
        updateUI();
        gameOver = false;
        document.getElementById('result').textContent = '';
    }

    function hit() {
        if (!gameOver) {
            playerCards.push(dealCard());
            playerScore = calculateScore(playerCards);
            updateUI();
            if (playerScore > 21) {
                endGame('You busted! Dealer wins.');
            }
        }
    }

    function stand() {
        if (!gameOver) {
            while (dealerScore < 17) {
                dealerCards.push(dealCard());
                dealerScore = calculateScore(dealerCards);
                updateUI();
            }
            if (dealerScore > 21 || dealerScore < playerScore) {
                endGame('You win!');
                bank += bet * 2;
            } else if (dealerScore > playerScore) {
                endGame('Dealer wins.');
            } else {
                endGame('It\'s a tie!');
                bank += bet;
            }
            document.getElementById('bank').textContent = `Bank: $${bank}`;
        }
    }

    function endGame(message) {
        gameOver = true;
        document.getElementById('result').textContent = message;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('deal-btn').style.display = 'none';
        document.getElementById('hit-btn').style.display = 'none';
        document.getElementById('stand-btn').style.display = 'none';
    }

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('deal-btn').addEventListener('click', deal);
    document.getElementById('hit-btn').addEventListener('click', hit);
    document.getElementById('stand-btn').addEventListener('click', stand);

    // Initial deck setup
    initDeck();
