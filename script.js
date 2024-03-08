// fetch all data using querysele
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");

const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()[]{}/?|:';
// by default
let password="";
let passwordLength=10;
let checkCount=0;
// set strentgh circle color to grey
setIndicator("#ccc");

// set passwordLength
function handleSlider()
{
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    // after css code
    let min=inputSlider.min;
    let max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
                                        //  width % and height %
}
handleSlider();

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

// ramdomnumber
function getRandomInteger(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRandomInteger(0,9);
}
function generateUppercase()
{
    return String.fromCharCode(getRandomInteger(65,90));
}
function generateLowercase()
{
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateSymbol()
{
    const radNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(radNum);
}
// calculate strength
function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower &&(hasNum||hasSym)&& passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper)&&
            (hasNum||hasSym)&&passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
// copy gnerated pass
async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);//
    //this method will copy pass
        copyMsg.innerText='copied';
    }
    catch(e)
    {
        copyMsg.innerText='failed';
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(
        ()=>{copyMsg.classList.remove("active");}
        ,2000);
     
}

// events
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(password.length>0)//passworDisplay.value
    {
        copyContent();
    }
});

function handleCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>
    {
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// main code
generateBtn.addEventListener('click',
()=>{
    // none of the checkbox are selected
    if(checkCount<=0) return;//no pass will given
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    //lets start the jounery of fing new password
    //remove old pass
    password="";
    //lets put stuff mentioned by checkboxes
    // if(uppercaseCheck.checked)
    // {
    //     password +=generateUppercase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password +=generateLowercase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password +=generateRandomNumber();
    // }
    // if(symbolsCheck.checked)
    // {
    //     password +=generateSymbol();
    // }

    let funArr=[];
    if(uppercaseCheck.checked)
        funArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funArr.push(generateLowercase);
    
    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funArr.push(generateSymbol);

    // compulsory addition
    for(let i=0;i<funArr.length;i++)
    {
        password +=funArr[i]();
    }
    //remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randIndex=getRandomInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;
    //calculating strength
    calcStrength();

});
function shufflePassword(array)
{
    //fisher yates method
    for(let i=array.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}