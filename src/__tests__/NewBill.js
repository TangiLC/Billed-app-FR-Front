/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import bills from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import storeFromMock from "../__mocks__/store";
import {fireEvent, getByTestId, logDOM, screen, waitFor} from "@testing-library/dom";

beforeEach(() => {
  const newBillBodyHTML = NewBillUI();
  document.body.innerHTML = newBillBodyHTML;
  window.localStorage.setItem("user",JSON.stringify({type: "Employee",
      email: "employee@test.tld", password: "employee", status: "connected"})
  )})


describe("Given I am connected as an employee", () => {
  describe("When I am on the NewBill Page", () => {

    test("Then the left-nav active icon should be *mail* ", async () => {
      Object.defineProperty(window, "localStorage", {value: localStorageMock})
      window.localStorage.setItem("user", JSON.stringify({type: "Employee" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getAllByTestId("icon-mail"))
      const activIcon = screen.getAllByTestId("icon-mail")[0]
      expect(activIcon.classList.value).toMatch("active-icon")
    })//##############################################################################

    describe("When I'm filling the whole form", () => {

      test("But no file upload, fileUrl should return null", () => {
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        const newBills = new NewBill({document, onNavigate, localStorage: window.localStorage})
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile)

        const fileInput = screen.getByTestId("uploadFile")
        fileInput.addEventListener("change", handleChangeFile)
        expect(newBills.fileUrl).toBeNull()
      })//##############################################################################

      test("And the uploaded file is .jpg, .jpeg or .png, filetype should exist and return valid", () => {
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        const newBills = new NewBill({document, onNavigate, store: storeFromMock, localStorage: window.localStorage})
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile)

        const fileInput = screen.getByTestId("uploadFile")
        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, 
          {target: {files: [new File(["test.jpeg"], "test.jpeg", {type: "image/jpeg"})]}})
        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.files[0].type).toBe("image/jpeg");
      })//##############################################################################

      test("And the uploaded file is not valid format, the input should be empty", () => {
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        const newBills = new NewBill({document, onNavigate, store: storeFromMock, localStorage: window.localStorage})
        const handleChangeFile = jest.fn(() => newBills.handleChangeFile)


        const fileInput = screen.getByTestId("uploadFile")
        fileInput.addEventListener("change", handleChangeFile)
        fireEvent.change(fileInput, 
          {target: {files: [new File(["test.txt"], "test.txt", {type: "text/txt"})]}})

        expect(fileInput.value).toBe("");
      })//##############################################################################

      test("Then a click on *submit* sends form to BackEnd", () => {
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        const newBills = new NewBill({document, onNavigate, storeFromMock, localStorage: window.localStorage})
        const handleSubmit = jest.fn(() => newBills.handleSubmit)

        const form = screen.getByTestId("form-new-bill")
        form.addEventListener("submit", handleSubmit)

        document.querySelector("select").value = "Transports"
        screen.getByTestId("expense-name").value = "Jest Test"
        screen.getByTestId("datepicker").value = "2012-12-12"
        screen.getByTestId("amount").value = 100
        screen.getByTestId("vat").value = 20
        screen.getByTestId("pct").value = 80
        screen.getByTestId("commentary").value = "This is a test"

        fireEvent.submit(form)
        expect(handleSubmit).toHaveBeenCalled();
        expect(form).toBeTruthy()
      })//##############################################################################
    })
  })
})