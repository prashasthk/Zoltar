import{saveState as n}from"./storage.js";import{toggleClassToArr as c}from"./util.js";let r={},o={};const a={currentMessage:"",currentNumbers:[],currentImageBack:"",currentImageFront:""};function t(){return!r.main.classList.contains("hidden-animation")}function i(){return!r.main.classList.contains("ticket-hoverable")}function s(){r.main.classList.add("hidden-animation"),r.main.classList.remove("ticket-hoverable"),o.main.classList.remove("hidden"),o.cover.classList.remove("hidden"),setTimeout(()=>{c([r.background,r.front,r.back],"flipped")},500)}function e(){r.ticketCount.classList.add("hidden"),r.main.classList.remove("hidden-animation"),setTimeout(()=>{r.main.classList.add("ticket-hoverable")},500)}function u(){i()||(r.main.classList.remove("ticket-hoverable"),c([r.background,r.front,r.back],"flipped"))}function d(e){return e.reduce((e,t,n,c)=>{return e+(n===c.length-1?", and":",")+" "+t})}function m(){r.text.innerText=a.currentMessage,r.numbers.innerText=d(a.currentNumbers),r.backgroundImage.src=`assets/images/image-bank-back/background-card-${a.currentImageBack}.png`,r.frontImage.src=`assets/images/image-bank-front/header-${a.currentImageFront}.png`}window.addEventListener("keydown",e=>{"Escape"===e.key&&t()&&i()&&s()}),document.addEventListener("DOMContentLoaded",function(){r={main:document.querySelector(".ticket-wrapper"),background:document.querySelector(".ticket-background"),backgroundImage:document.querySelector(".ticket-back-image"),frontImage:document.querySelector(".ticket-header-image"),front:document.querySelector(".ticket-front-content"),back:document.querySelector(".ticket-back-content"),buttonRemove:document.querySelector("#close-ticket"),text:document.querySelector("#fortune-content"),numbers:document.querySelector("#ticket-lucky-numbers"),ticketCount:document.querySelector(".count-tickets-circle")},o={main:document.querySelector(".save-delete-ticket"),save:document.getElementById("save-button"),discard:document.getElementById("discard-button"),cover:document.querySelector(".cover")},r.main.addEventListener("click",u),r.buttonRemove.addEventListener("click",s),[o.discard,o.save].forEach((e,t)=>{e.addEventListener("click",()=>{var e;e=t,c([o.main,o.cover,r.ticketCount],"hidden"),1===e&&n(a)})})});export{a as state,t as isTicketCurrentlyDisplayed,i as isTicketCurrentlyFlipped,e as toggleTicketOn,d as convertArrToReadableString,m as updateTicket};