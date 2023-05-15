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
      

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    /*test('should match snapshot', () => {
        expect(Bills.getBills.snapshot).toMatchInlineSnapshot()
    })*/

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
      
      const modaleProof = screen.getByTestId('proof')
      expect(modaleProof.innerHTML).not.toBe("")
      
    })

    test("Then a click on NewBill should open NewBill form", async () =>{
      
      document.body.innerHTML = BillsUI({data:bills});
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      
      const newBillsContainer= new Bills({document, onNavigate, store:null, bills, localStorage: window.localStorage });
      const btnNewBill = screen.getByTestId('btn-new-bill');
      const mockNewBill=jest.fn(newBillsContainer.handleClickNewBill()) 
      btnNewBill.addEventListener('click', mockNewBill)
      userEvent.click(btnNewBill)
      expect(mockNewBill).toHaveBeenCalled()
     
    })

    test("Then a bad formatted bill should throw an error", async () =>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      let corrupted = [{  //corrupted file on purpose missing name, email, and wrong format for most elems
        "id": "C0rrUP7eDF1Le","vat": NaN,"fileUrl": false,"status": "Wrong Format","type": "Wrong Format",
        "commentary": "Wrong Format", "fileName": "badBill.txt","date": "1999-09-09",
        "amount": "NaN","commentAdmin": "wrong", "pct": NaN
      }]

      document.body.innerHTML = BillsUI({data:corrupted})
      const navigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      const corruptedBillsContainer= new Bills({document, navigate, store:null, corrupted, localStorage: window.localStorage });
      const mockCorruptedBill=jest.fn(corruptedBillsContainer.getBills()) 
      mockCorruptedBill()
      expect(mockCorruptedBill).toHaveBeenCalled()

    })
  })
})
