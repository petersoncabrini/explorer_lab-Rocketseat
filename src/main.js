import "./css/index.css"
import IMask from 'imask';

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const background = document.getElementById("cc");
const ccNumber = document.getElementById("card-number");
const ccholder = document.getElementById("card-holder");
const ccExpiration = document.getElementById("expiration-date");
const ccSecurity = document.getElementById("security-code");
let inputs = [ccNumber, ccholder, ccExpiration, ccSecurity]

function setCardType(type) {

    const colors = {
        "visa": ["#436D99", "#2D57F2"],
        "mastercard": ["#DF6F29", "#C69347"],
        "default": ["black", "gray"],
        "futurama": ["", ""]
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])

    if (type == "futurama") {
        ccLogo.setAttribute("src", `cc-${type}.png`)
        ccLogo.setAttribute("class", "futurama-logo")
        background.style.backgroundImage = "url('futuramaBg.png')";
        background.style.borderRadius = "6%"
    } else {
        ccLogo.setAttribute("src", `cc-${type}.svg`)
        background.style.backgroundImage = "url('cc-bg.svg')";
    }

}

setCardType("default")


const securityCode = document.getElementById('security-code');
const securityCodePattern = {
    mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.getElementById('expiration-date');
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.getElementById('card-number')
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardType: 'visa'
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^3[47]\d{0,14}$/,
            cardType: 'futurama'
        },
        {
            mask: "0000 0000 0000 0000",
            cardType: 'default'
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        let number = (dynamicMasked.value + appended).replace(/\D/g, '');
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        console.log(foundMask)
        return foundMask;
    }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.getElementById('add-card');
addButton.addEventListener('click', () => {
    validateForm();
})

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
})

const cardholder = document.getElementById('card-holder');
cardholder.addEventListener('input', () => {
    const ccholder = document.querySelector('.cc-holder .value');
    ccholder.innerText = cardholder.value.length === 0 ? "FULANO DA SILVA" : cardholder.value;
})

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(cardNumber) {
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = cardNumber.length === 0 ? "1234 5678 9012 3456" : cardNumber
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
    const ccExpiration = document.querySelector('.cc-expiration .value')
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

function validateForm() {

    //add invalid class
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "") {
            inputs[i].classList.add("invalid")
        }
    }

    const invalidInputs = document.getElementsByClassName("invalid")
    if (invalidInputs.length == 0) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            background: "#202024",
            color: "white",
            title: 'Cartão adicionado com sucesso!',
            showConfirmButton: false,
            timer: 1500
        })

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }

}

function removeInvalid() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onchange = () => {
            inputs[i].classList.remove("invalid")
        }
    }
}

removeInvalid();