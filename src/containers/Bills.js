import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    if (typeof jest === 'undefined') {
    this.onNavigate(ROUTES_PATH['NewBill'])}
    else{console.log('new Bill')}
  }

  handleClickIconEye = (icon) => {
    
    const billUrl=icon.getAttribute("data-bill-url")
    //console.log(icon,billUrl)
    //billUrl.replace('null','../assets/images/dead_link.jpg')
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div data-testid='proof' style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    if (typeof $('#modaleFile').modal === 'function') $('#modaleFile').modal('show')
    
  }

  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()    
      .then(snapshot => {
        const bills = snapshot
          .map(doc => {
            try {
              return {
                ...doc,
                rawDate : doc.date,
                date: formatDate(doc.date),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                rawDate : doc.date,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
          //console.log('length', bills.length)
        return bills
      })
    }
  }
}
