const clientCash = document.getElementById('cash');
const purchaseButton = document.getElementById('purchase-btn');
const output = document.getElementById('change-due');
const drawerDisplay = document.getElementById('drawer-display');
const priceDisplay = document.getElementById('price-display');

let price = 19.5;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// let cid = [
//     ['PENNY', 0.5],
//     ['NICKEL', 0],
//     ['DIME', 0],
//     ['QUARTER', 0],
//     ['ONE', 0],
//     ['FIVE', 0],
//     ['TEN', 0],
//     ['TWENTY', 0],
//     ['ONE HUNDRED', 0]
//   ];

updateDrawerDisplay();

purchaseButton.addEventListener('click', () =>
{
    if (clientCash.value.trim() === '')
    {
        return;
    }
    
    const clientMoney = Number.parseFloat(clientCash.value);
    clientCash.value = '';

    if (clientMoney < price)
    {
        alert('Customer does not have enough money to purchase the item');
        return;
    }
    else if (clientMoney === price)
    {
        output.textContent = 'No change due - customer paid with exact cash';
        return;
    }
    else
    {
        const changeDue = Number.parseFloat((clientMoney - price).toFixed(2));
        output.innerHTML = traverseDrawer(changeDue, cid);
        updateDrawerDisplay();
        return;
    }
});

function updateDrawerDisplay()
{
    const denominationMap = getFormattedDenominations();

    const drawerContent = cid.map(([currency, amount]) =>
    {
        const formattedCurrency = denominationMap[currency] || currency;

        return `<p>${formattedCurrency}: $${amount % 1 === 0 ? amount : amount.toFixed(2)}</p>`;
    }).join('');
    
    drawerDisplay.innerHTML = drawerContent;
    priceDisplay.innerText = `Total: $${price}`;
}

function sumArray(array)
{
    return(Number.parseFloat(
        array.reduce((accumulator, currentValue) =>
            accumulator + currentValue[1], 0)
        .toFixed(2))
    );
}

function getFormattedDenominations()
{
    return(
    {
        'PENNY': 'Pennies',
        'NICKEL': 'Nickels',
        'DIME': 'Dimes',
        'QUARTER': 'Quarters',
        'ONE': 'Ones',
        'FIVE': 'Fives',
        'TEN': 'Tens',
        'TWENTY': 'Twenties',
        'ONE HUNDRED': 'Hundreds'
    });
}

function mapCurrencyToValue(currency)
{
    const coin = 
    {
        'PENNY': 0.01,
        'NICKEL': 0.05,
        'DIME': 0.1,
        'QUARTER': 0.25,
        'ONE': 1,
        'FIVE': 5,
        'TEN': 10,
        'TWENTY': 20,
        'ONE HUNDRED': 100

    };

    return(coin[currency]);
}


function traverseDrawer(change, array)
{
    let remainingChange = change;
    const changeArray = [];
    let totalCashInDrawer = sumArray(array);
    

    for (let index = array.length - 1; index >= 0; index--)
    {
        const currenyName = array[index][0];
        const currencyValue = mapCurrencyToValue(currenyName);
        const amountInCurrency = array[index][1];
        
        if (remainingChange < currencyValue || amountInCurrency  === 0)
        {
            continue;
        }
        else
        {
            let amountToGive = getClientChange(remainingChange,
                currencyValue, amountInCurrency);
            
            if (amountToGive)
            {
                changeArray.push([currenyName, amountToGive]);
                remainingChange  -= amountToGive;
                remainingChange = Number.parseFloat(remainingChange.toFixed(2));
                array[index][1] -= amountToGive;
            }
        }

        if (remainingChange <= 0)
        {
            break;
        }
    }


    if (remainingChange > 0)
    {
        return('Status: INSUFFICIENT_FUNDS');
    }
    else
    {
        changeArray.sort((a, b) => mapCurrencyToValue(b[0]) - mapCurrencyToValue(a[0]));
        let status = (remainingChange === 0 && totalCashInDrawer === change) ? 'Status: CLOSED' : 'Status: OPEN';

        let changeDetails = changeArray.map(([currenyName, amount]) =>
        {
            return(`${currenyName}: $${amount}<br>`);
        }).join(' ');

        return(`${status}<br> ${changeDetails}`);
    }
}

function getClientChange(remainingChange,
    currencyValue, amountInCurrency)
{
    let amoutToGive = 0;
    let maxAmountCanGive = Math.floor(amountInCurrency /
        currencyValue);

    while (remainingChange >= currencyValue &&
        maxAmountCanGive > 0)
    {
        amoutToGive += currencyValue;
        remainingChange -= currencyValue;
        remainingChange = Number.parseFloat(remainingChange.toFixed(2));
        maxAmountCanGive--;
    }

    if (amoutToGive > 0)
    {
        return(Number.parseFloat(amoutToGive.toFixed(2)));
    }

    return(0);
}