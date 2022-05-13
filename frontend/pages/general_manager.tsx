import type { NextPage } from 'next'

function Create(){
    return(
        console.log('create')
    )
}
function Update(){
    return(
        console.log('update')
    )
}
function Read(){
    return(
        console.log('read')
    )
}
function Delete(){
    return(
        console.log('delete')
    )
}
const General: NextPage=() => {
    return(
        <div className='GeneralArea'>
            <div id='Create_Account' onClick={Create}>Create</div>
            <div id='Update_Account' onClick={Update}>Update</div>
            <div id='Read_Account' onClick={Read}>Read</div>
            <div id='Delete_Account' onClick={Delete}>Delete</div>
            <div id='Graph'>데이터 시각화</div>
        </div>
    )
}

export default General