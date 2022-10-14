let balanceEl = document.querySelector(".balance .value");
let incomeTotalEl = document.querySelector(".income-total");
let outcomeTotalEl = document.querySelector(".outcome-total");
let incomeEl = document.querySelector("#income");
let expenseEl = document.querySelector("#expense");
let allEl = document.querySelector("#all");
let incomeList = document.querySelector("#income .list");
let expenseList = document.querySelector("#expense .list");
let allList = document.querySelector("#all .list");

let expenseBtn = document.querySelector(".tab1");
let incomeBtn = document.querySelector(".tab2");
let allBtn = document.querySelector(".tab3");

expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide( [incomeEl, allEl] );
    active( expenseBtn );
    inactive( [incomeBtn, allBtn] );
})
incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide( [expenseEl, allEl] );
    active( incomeBtn );
    inactive( [expenseBtn, allBtn] );
})
allBtn.addEventListener("click", function(){
    show(allEl);
    hide( [incomeEl, expenseEl] );
    active( allBtn );
    inactive( [incomeBtn, expenseBtn] );
})

let addExpense = document.querySelector(".add-expense");
let expenseTitle = document.getElementById("expense-title-input");
let expenseAmount = document.getElementById("expense-amount-input");

let addIncome = document.querySelector(".add-income");

addIncome.addEventListener("click", function(){

    if(!incomeTitle.value || !incomeAmount.value ) return;
    let income = {
        type : "income",
        title : incomeTitle.value,
        amount : parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [incomeTitle, incomeAmount] )
})

let incomeTitle = document.getElementById("income-title-input");
let incomeAmount = document.getElementById("income-amount-input");

let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
let DELETE = "delete", EDIT = "edit";

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

addExpense.addEventListener("click", function(){
    if(!expenseTitle.value || !expenseAmount.value ) return;

    let expense = {
        type : "expense",
        title : expenseTitle.value,
        amount : parseInt(expenseAmount.value)
    }
    ENTRY_LIST.push(expense);

    updateUI();
    clearInput( [expenseTitle, expenseAmount] )
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);


function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if( targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if(targetBtn.id == EDIT ){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);

    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    let sign = (income >= outcome) ? "$" : "-$";
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`;

    clearElement( [expenseList, incomeList, allList] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id){

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    })
}
function show(element){
    element.classList.remove("hide");
}

function hide( elements ){
    elements.forEach( element => {
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive( elements ){
    elements.forEach( element => {
        element.classList.remove("active");
    })
}