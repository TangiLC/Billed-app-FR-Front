/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then submiting form creates new entry", () => {
      const html = NewBillUI()
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      document.body.innerHTML = html
      const handleSubmit1 =jest.fn()
      

      handleSubmit1.handleSubmit()
    expect(handleSubmit1()).toBeCalled()
    })

    test("Then selecting a .jpg files adds file", () => {
      const html = NewBillUI()
      screen.innerHTML = html
      const handleChangeFile1 =jest.fn()


      handleChangeFile1.handleChangeFile()
    expect(handleChangeFile1()).toBeCalled()

    })
  })
})
