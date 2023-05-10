/**
 * @jest-environment jsdom
 */
import userEvent from '@testing-library/user-event'
import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";
import { ROUTES } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
    test("Then submit form creates new entry", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const navigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      window.onNavigate(ROUTES_PATH.NewBill)
      const novBill = new NewBill({ document, navigate, store:null, localStorage })
      document.body.innerHTML = html
      userEvent.type(screen.getByTestId('expense-type'),"test ExpenseType")
      userEvent.type(screen.getByTestId('expense-name'),"test ExpenseName")
      userEvent.type(screen.getByTestId('amount'),"100")
      userEvent.type(screen.getByTestId('datepicker'),"2012-12-12")
      userEvent.type(screen.getByTestId('vat'),"20")
      userEvent.type(screen.getByTestId('pct'),"80")
      userEvent.type(screen.getByTestId('commentary'),"test Comment")
      
    
      const formNewBill = screen.getByTestId('form-new-bill')
      //formNewBill.addEventListener("submit", this.handleSubmit)
      const mockHandle = jest.fn(novBill.handleSubmit(formNewBill))
      const mockNew = jest.fn(addEventListener("click", mockHandle))
      userEvent.click(formNewBill)
      console.log('submit')
       
    expect(mockHandle).toHaveBeenCalled()

    })

    test("Then selecting a .jpg files adds file", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const navigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
      window.onNavigate(ROUTES_PATH.NewBill)
      const novBill = new NewBill({ document, navigate, store:null, localStorage })
      document.body.innerHTML = html
    
      const formNewBill = screen.getByTestId('file')
      //formNewBill.addEventListener("submit", this.handleSubmit)
      const mockHandle = jest.fn(novBill.handleChangeFile(formNewBill))
      const mockNew = jest.fn(addEventListener("click", mockHandle))
      userEvent.click(formNewBill)
      console.log('submit')
       
    expect(mockHandle).toHaveBeenCalled()

    })
  })
})
