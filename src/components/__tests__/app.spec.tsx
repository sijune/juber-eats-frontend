import { render, waitFor } from "@testing-library/react"
import { App } from "../app"
import React from "react";
import { isLoggedInVar } from '../../apollo';

jest.mock("../../routers/logged-out-router", ()=> {
    return {
        LoggedOutRouter: () => <span>logged-out</span>
    }
})

jest.mock("../../routers/logged-in-router", ()=> {
    return {
        LoggedInRouter: () => <span>logged-in</span>
    }
})

//test 시 코드 내용이 아니라 코드 Output만 테스트한다.
describe("<App />", () => {
    it("renders LoggedOutRouter", () => {
        const { getByText} = render(<App />);
        getByText("logged-out")
    })
    it("renders LoggedInRouter", async () => {
        const {getByText, debug} = render(<App />);
        //debug()
        //login한 경우 isLoggedInVar가 true로 업데이트되므로
        await waitFor(()=> {
            isLoggedInVar(true);
        })
        //debug()
        
        getByText("logged-in")
    })
})