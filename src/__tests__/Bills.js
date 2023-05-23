/**
 * @jest-environment jsdom
 */

import {fireEvent, getByTestId, logDOM, screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js"
import Bills from "../containers/Bills"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {value: localStorageMock})
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId("icon-window"))
      const activeIcon = screen.getByTestId("icon-window")
      
      expect(activeIcon.classList.value).toMatch("active-icon")
    })//#########################################################################################

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML)
      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })//#########################################################################################

    test("The button *create New bill* should be present and redirect to New Bill page", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const btnNewBill = screen.getByTestId("btn-new-bill")
      expect(btnNewBill.textContent).toBe("Nouvelle note de frais")

      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const testBill = new Bills({document, onNavigate, store:bills, localStorage: window.localStorage})
      const handleClickNewBill = jest.fn(testBill.handleClickNewBill())
      btnNewBill.addEventListener("click", handleClickNewBill)

      fireEvent.click(btnNewBill);
      expect(handleClickNewBill).toHaveBeenCalled()

      expect(document.body.innerHTML).not.toBe(BillsUI({ data: bills }))
    })//#########################################################################################

    test("On click on *eye icon* a modal should open", () => {
        window = { ...window, localStorage: localStorageMock }
        window.localStorage.setItem("user", JSON.stringify({type: "Employee"}))
        document.body.innerHTML = BillsUI({ data: bills })
        
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        
        const testBill = new Bills({document, onNavigate, store:bills, localStorage: window.localStorage})
        $.fn.modal = jest.fn()

        const eyeIcon = screen.getAllByTestId("icon-eye")[0]
        expect(eyeIcon).not.toBeNull()

        const handleClickIconEye = jest.fn(testBill.handleClickIconEye(eyeIcon))
        eyeIcon.addEventListener("click", handleClickIconEye)
        fireEvent.click(eyeIcon)
        expect(handleClickIconEye).toHaveBeenCalled()
        const modalProof = screen.getByTestId("proof")
        expect(modalProof.innerHTML).not.toBeNull()
      })//#########################################################################################
  })

  describe("When I am on the Bills Page", () => {
    test("fetches bills from the mock API using GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      expect(buttonNewBill).toBeTruthy();
    })//#########################################################################################

    describe("When an error occurs to the API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(window, "localStorage", {value: localStorageMock})
        window.localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }}
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })//#########################################################################################

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }}
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })//#########################################################################################
    })
  })
})
