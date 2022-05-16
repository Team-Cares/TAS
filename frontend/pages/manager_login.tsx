import type { NextPage } from 'next'
function LogIn(){
    let ID = ID_text.value;
    let PW = PW_text.value;
    console.log(ID),
    console.log(PW)
}
const Manager: NextPage=() => {
    return(
    <div className="LogIn">
        <input type="text" placeholder='아이디' id='ID_text'></input>
        <input type="password" placeholder='비밀번호' id='PW_text'></input>
        <button type="submit" onClick={LogIn}>Log In</button>
    </div>
    )
}

export default Manager