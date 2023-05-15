/**
 * @jest-environment jsdom
 */
import userEvent from '@testing-library/user-event'
import { getByRole, getByTestId, fireEvent, screen } from '@testing-library/dom';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";
import { ROUTES } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


let newBillContainer
let onNavigate

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  root.innerHTML = NewBillUI()
  
  onNavigate = jest.fn()
  newBillContainer = new NewBill({ document, onNavigate, store:null, localStorage })
  
});

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
    test("Then submit form creates new entry", async() => {
     
      fireEvent.change(screen.getByTestId("expense-type"), {target: { value: "Transports" }});
      fireEvent.change(screen.getByTestId("expense-name"), {target: {value: 'Test Jest'}})
      fireEvent.change(screen.getByTestId("datepicker"), {target: {value: '2012-12-12'}})
      fireEvent.change(screen.getByTestId("amount"), {target: {value: 100}})
      fireEvent.change(screen.getByTestId("vat"), {target: {value: 20}})
      fireEvent.change(screen.getByTestId("pct"), {target: {value: 80}})
      const testFile = new File([test], 'test.jpg', {type: 'image/jpg'});
      const input = screen.getByTestId('uploadFile')
      userEvent.upload(input, testFile)
     
      const form = screen.getByTestId("form-new-bill");
      const updateBill = jest.fn(newBillContainer.updateBill)
      fireEvent.submit(form)
      expect(form).toBeTruthy();
      expect(updateBill).toHaveBeenCalled();
  })   

    test("Then selecting a .jpg files adds file", async() => {
      const testFile = new File([test], 'test.jpg', {type: 'image/jpg'});
      const input = screen.getAllByTestId('uploadFile')
      userEvent.upload(input[0], testFile)
      const updateBill = jest.fn(newBillContainer.updateBill)

    expect(updateBill).toHaveBeenCalled()

    })
  })
})
