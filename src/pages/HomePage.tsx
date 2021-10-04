import Header from '../components/Header'
import LeaderBar from '../components/LeaderBar'
import MessageBoard from '../components/MessageBoard';
import { MyCustomCSS } from '../components/MyCustomCSS';

const HomePage = () => {
  return (
    <>
      <Header classes='header grid'
        style={{'grid-template-columns': '2fr 1fr 1fr'} as MyCustomCSS}
      />
      <LeaderBar classes='leader-bar grid'
        style={{'grid-template-columns': '2fr 1fr 1fr'} as MyCustomCSS}
      />
      <MessageBoard classes='message-board'/>
    </>
  );
}

export default HomePage;