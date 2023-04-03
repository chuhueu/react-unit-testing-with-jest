import ReactDOM from 'react-dom/client';
import LoginComponent from './app/LoginComponent';
import LoginService from './services/LoginService';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const loginService = new LoginService();

const setToken = (token:string) =>{
  console.log(`received the token ${token}`)
}

root.render(
    <LoginComponent loginService={loginService} setToken={setToken} />
);