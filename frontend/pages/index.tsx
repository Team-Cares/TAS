import type { NextPage } from 'next'


const Home: NextPage = () => {
  const title = "abc";
  const handleClick = () => {
    navigate('/client', {
      state: {
        title: title,
      },
    });
  }
  return (
    <div>
      <button onClick={handleClick}>버튼</button>
    </div>
  )
}

export default Home;
