import React, { useState } from 'react';


/*
상단의 생성 버튼을 누르면

상담 제목과 원하는 시간 상담 내용을 입력할수 있는 뷰 생성

뷰생성이후 확인or저장을 누르면 

원래 뷰에서 리스트 형식으로 상담 제목만을 띄워 배치
*/

function Header(props){
    return <header>
        <h1><a href = "/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
        }}>{props.title}</a></h1>
    </header>
}
function Nav(props){
    const lis = []
    for(let i=0; i<props.topics.length; i++){
        let t = props.topics[i];
        lis.push(<li key={t.id}>
            <a id = {t.id} href ={'/read/'+t.id} onClick={event=>{
                event.preventDefault();
                props.onChangeMode(Number(event.target.id));
            }}>{t.title}</a>
            </li>)
    }
    return <nav>
    <ol>
        {lis}
    </ol>
    </nav>
}

function Article(props){
    return <article>
                <h2>{props.title}</h2>
                    {props.body}
            </article>
}

function Create(props){
    return <article>
        <h2>Create</h2>
        <form onSubmit={event=>{
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onCreate(title, body);
        }}>
            <p><input type = "text" name = "title" placeholder='title'/></p>
            <p><textarea name = "body" placeholder='body'></textarea></p>
            <p><input type = "submit" value = "상담생성"/></p>
        </form>
    </article>
}

const RegistContent: React.FC = () => {
    const [mode, setMode] = useState('Welcome');
    const [id, setId] = useState(null);
    const [nextId, setNextId] = useState(1);
    const [topics, setTopics] = useState([])
    let content = null;
    if(mode === "Read"){
        let title, body = null;
        for(let i = 0; i<topics.length; i++){
            if(topics[i].id === id){
                title = topics[i].title;
                body = topics[i].body;
            }
        }
        content = <Article title = {title} body = {body}></Article>
    }  else if(mode === 'Create'){
        content = <Create onCreate={(_title, _body)=>{
            const newTopic = {id:nextId, title:_title, body:_body}
            const newTopics = [...topics]
            newTopics.push(newTopic);
            setTopics(newTopics);
            setMode('READ');
            setId(nextId);
            setNextId(nextId+1);
        }}></Create>
    }
    return(
        <div>
            <button onClick={event =>{
                event.preventDefault();
                setMode('Create');
            }}>Create</button>
            <Header title = "Home" onChangeMode={()=>{
                setMode('Welcome');
            }}></Header>
            <Nav topics = {topics} onChangeMode={(id)=>{
                setMode('Read');
                setId(id);
            }}></Nav>
            {content}
        </div>
    )
}
export default RegistContent;