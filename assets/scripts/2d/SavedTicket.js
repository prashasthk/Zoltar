import{convertArrToReadableString as t}from"../ticket.js";import{removeCard as e}from"./ticketHistory.js";class s extends HTMLElement{constructor(){super(),this.identifier=null;var e=this.attachShadow({mode:"open"}),t=document.createElement("section"),s=(t.classList.add("ticket","savedTicket"),t.innerHTML="",document.createElement("style")),o=(s.innerHTML=`
		    @import url('./assets/styles/twodee.css');
            @import url('./assets/styles/ticket.css');
		`,document.createElement("button")),r=(o.classList.add("clickable"),o.innerText="Discard",document.createElement("div"));r.append(o),t.append(s,r),e.append(t)}connectedCallback(){this.shadowRoot.querySelector("div").classList.add("deleteTicket"),this.shadowRoot.querySelector("button").addEventListener("click",()=>{e(this)})}set index(e){this.identifier=e}set content(e){e&&(this.shadowRoot.querySelector("section").innerHTML+=`
            <img loading="lazy" src="/assets/images/horizontalrule.png" class="top">
	        <h1 class="ticket-title" class="loaded-message">YOUR FORTUNE</h1>
            <img loading="lazy" src="assets/images/image-bank-front/header-${e.currentImageFront}.png" 
				class="ticket-header-image">
	        <p class="fortune-text">${e.currentMessage}</p>
			<p class="fortune-number">
				Your lucky numbers are ${t(e.currentNumbers)}
			</p>
	        <img loading="lazy" src="/assets/images/horizontalrule.png" class="bottom">
	        `)}set position(e){this.shadowRoot.querySelector("section").style.transform=""+e}set zIndex(e){this.shadowRoot.querySelector("section").style.zIndex=""+e}testAlert(){this.shadowRoot.querySelector("button").innerText="wwww"}}customElements.define("saved-ticket",s);