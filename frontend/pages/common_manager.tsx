import type { NextPage } from 'next'
import { getDisplayName } from 'next/dist/shared/lib/utils'
import { Html } from 'next/document'

function Modal_Consulting () {
    return(
        <div>
            <form id='Input' style = {{display: "none"}}>
                <input type='text' placeholder='날짜' id='Date'></input>
                <input type='text' placeholder='상담사' id='User'></input>
                <input type='textarea' placeholder='상담내용' id='Text'></input>
                <button id='Next' onClick={Input_Next}>Next(상담완료)</button>
                <button id='Close_Modal' onClick={Input_X}>X</button>
            </form>
        </div>
    )
}
function RejectBtn () {
    console.log("reject button")
}
function Input_OK () {
    return (
        Input.style.display="block"
    );
}
function Input_X(){
    return (
        Input.style.display="none"
    );
}
function Input_Next(){
    return(
        console.log(Input.Date.value),
        console.log(Input.User.value),
        console.log(Input.Text.value)
    )
}
const Common: NextPage=() => {
    return(
        <div className="CommonArea">
            <button type="button" className="Reject" onClick={RejectBtn}>상담 거부</button>
            <button type="button" className="Ok" onClick={Input_OK}>상담 승인</button>
            <Modal_Consulting></Modal_Consulting>
        </div>
    )
}

export default Common