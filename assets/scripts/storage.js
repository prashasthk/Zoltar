import{toggleClassToArr as e,clamp as n}from"./util.js";let r={},c=[];const i={currentlySelected:0};function o(){e([r.cover,r.historyWrapper,r.circleButton],"hidden")}function l(){return JSON.parse(window.localStorage.getItem("tickets"))||[]}function u(e){r.inputCounter.innerText=c.length;let t;t=void 0===e?c.length:e,r.ticketCounter.innerText=t,r.inputField.value=i.currentlySelected+1}function t(e,t){var n=l();return!(99<=n.length||(n.push(e),window.localStorage.setItem("tickets",JSON.stringify(n)),"2d"!==t&&u(n.length),0))}function d(e){window.localStorage.setItem("tickets",JSON.stringify(e))}function s(){c.forEach((e,t)=>{var t=t-i.currentlySelected,n=300*(t<0?-1:1)*(1-.9**Math.abs(t)),t=.9**Math.abs(t);e.style.transform=`translate(calc(${n}vw - 50%), -50%) scale(${t})`})}function a(e){var t=c.indexOf(e);-1!==t&&(r.ticketHistory.removeChild(e),c.splice(t,1),(e=l()).splice(t,1),d(e),0===c.length?i.currentlySelected=0:i.currentlySelected=n(i.currentlySelected,0,c.length-1),u(),s(),0===c.length)&&o()}function h(e,t){e.forEach(e=>{e[t+"EventListener"]("mouseover",e.handleButtonOverlay),e[t+"EventListener"]("mouseout",e.handleButtonOverlay)})}function y(){var e=l();0!==e.length&&(r.cover.classList.remove("hidden"),r.historyWrapper.classList.remove("hidden"),r.circleButton.classList.add("hidden"),c.length!==e.length&&(h(c,"remove"),c=[],e.forEach(e=>{var t=document.createElement("historical-ticket");t.content=e,c.push(t)}),r.ticketHistory.replaceChildren(...c)),c[i.currentlySelected].selected=!0,r.inputCounter.innerText=c.length,h(c,"add"),s())}function v(e){var t;i.currentlySelected=(t=i.currentlySelected,n(t+e,0,c.length-1)),r.inputField.value=i.currentlySelected+1,s()}function p(){e=r.inputField.value,t=i.currentlySelected+1,e=+e;var e,t=Number.isNaN(e)?t:n(e,1,c.length);r.inputField.value=t,i.currentlySelected=t-1,s()}function g(e){r.historyWrapper.classList.contains("hidden")||("ArrowLeft"===e.key?v(-1):"ArrowRight"===e.key?v(1):"Escape"===e.key&&o())}window.addEventListener("DOMContentLoaded",function(){(r={ticketCounter:document.getElementById("ticket-count"),circleButton:document.querySelector(".count-tickets-circle"),cover:document.querySelector(".cover"),ticketHistory:document.querySelector(".ticket-history"),leftButton:document.querySelector("#left-button"),rightButton:document.querySelector("#right-button"),inputField:document.querySelector("#ticket-history-input"),inputCounter:document.querySelector("#ticket-history-total"),exitHistoryButton:document.querySelector("#close-history"),historyWrapper:document.querySelector(".history-wrapper")}).circleButton.addEventListener("click",y),r.inputField.addEventListener("change",p),r.exitHistoryButton.addEventListener("click",o),r.leftButton.addEventListener("click",()=>{v(-1)}),r.rightButton.addEventListener("click",()=>{v(1)}),window.addEventListener("keydown",g),u(l().length)});export{l as getAllTickets,t as saveState,d as saveAllStates,a as deleteCard};