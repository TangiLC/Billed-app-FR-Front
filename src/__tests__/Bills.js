/**
 * @jest-environment jsdom
 */
import userEvent from '@testing-library/user-event'
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import { ROUTES } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Router from "../app/Router.js";
import {handleClickNewBill} from "../containers/Bills.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      Router()
      window.onNavigate(ROUTES_PATH.Bills)
      //console.log('active-icon')
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.add('active-icon')).toHaveBeenCalled
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then a click on iconeye should open modal", async () =>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({data:bills});
      const navigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      const billsContainer= new Bills({document, navigate, store:null, bills, localStorage: window.localStorage });
      const eye = screen.getAllByTestId('icon-eye');    
      userEvent.click(eye[0])
      const modalProof = screen.getByTestId('proof')
      expect(modalProof).not.toBe("")
    })

    test("Then a click on NewBill should open NewBill form", async () =>{
      
      document.body.innerHTML = BillsUI({data:bills});
      const navigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      const newBillsContainer= new Bills({document, navigate, store:null, bills, localStorage: window.localStorage });
      const btnNewBill = screen.getByTestId('btn-new-bill');
      console.log(btnNewBill.innerHTML)   
      const mockNewBill=jest.fn(newBillsContainer.handleClickNewBill()) 
      btnNewBill.addEventListener('click', mockNewBill)
      userEvent.click(btnNewBill)
      expect(mockNewBill).toHaveBeenCalled()
     
    })

    /*test("Then a bad formatted bill should throw an error", async () =>{
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const corrupted =[{
        "id": "7hi5i5C0rrUP7eD","vat": 20,"fileUrl": false,"status": "Wrong Format","type": "Wrong Format",
        "commentary": "Wrong Format","name": 123, "fileName": "badBill.jpg","date": "1999-09-09",
        "amount": "400","commentAdmin": "wrong", "email": "wrong@format","pct": 20
      },
      {
        "id": "47qAXb6fIm2zOKkLzMro", "vat": "80", "status": "pending", "type": "Hôtel et logement",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "commentary": "séminaire billed", "name": "encore", "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04", "amount": 400, "commentAdmin": "ok", "email": "a@a", "pct": 20
      }]
      document.body.innerHTML = BillsUI({data:corrupted})
    })*/
  })
})
