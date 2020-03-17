import React , {useState , useEffect} from 'react';
import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import api from './services/api';

// Componente : BLoco isolado de HTML , CSS  e JS, o qual não interfere no restante da aplicação
// Propriedade : Informações que um ocmponente pai passa para o componente filho
// Estado : Informações mantidas pelo componente ( Conceito de imutabilidade)

function App() {
const [users, setUsers] = useState([]);

const [latitude, setLatitude ] = useState('');
const [longitude, setLongitude ] = useState('');
const [name, setName ] = useState('');
const [specs, setSpecs ] = useState('');
const [avatar_url, setAvatarUrl] = useState('');
const [bio, setBio] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude , longitude } = position.coords;

        setLatitude (latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout : 30000,
      }
    );
  }, []);

  useEffect(() => {
    async function loadUsers(){ 
      const response = await api.get('/users');

      setUsers(response.data);
    }

    loadUsers();
  },[]);

  async function handleAddUser(e){
    e.preventDefault();

    const response = await api.post('/users' , {
      name,
      bio,
      avatar_url,
      specs,
      latitude,
      longitude,
    })

    setAvatarUrl('');
    setBio('');
    setName('');
    setSpecs('');

    async function loadUsersAfterAdd(){
      const response =  await api.get('/users');
      setUsers(response.data);
    }

    // add um novo usuario na sessão
    loadUsersAfterAdd();
  }

  async function handleDeleteUser(e){
    e.preventDefault();
    const response = await api.delete('/delete' , )

    setAvatarUrl('');
    setBio('');
    setName('');
    setSpecs('');

    async function loadUsersAfterDelete(){
      const response =  await api.get('/users');
      setUsers(response.data);
    }

    loadUsersAfterDelete();
  }

  async function handleDeleteUserById(e){
    
    const { name,bio,avatar_url,specs, latitude, longitude } = e;
    
    console.log(name);
    const response = await api.post('/deleteUser'  , {
      name,
  })

    setAvatarUrl('');
    setBio('');
    setName('');
    setSpecs('');

    async function loadUsersAfterDelete(){
      const response =  await api.get('/users');
      setUsers(response.data);
    }

    // add um novo usuario na sessão
    loadUsersAfterDelete();
  }

  return (
    <div id = "app">
      <aside> 
        <strong> Cadastrar </strong>
        <form onSubmit={handleAddUser} onReset={handleDeleteUser} onAbort={handleDeleteUserById}>
          <div className="input-block">  
            <label htmlFor="name"> Nome</label>
            <input 
              name="name" 
              id = "name" 
              required  
              value = {name}
              maxLength="70"
              onChange={e => setName(e.target.value)}
            />
          </div> 

          <div className="input-block">  
            <label htmlFor="bio">  Biografia </label>
            <input 
              name="bio" 
              id = "bio"
              required
              maxLength="100"
              value = {bio}
              onChange={e => setBio(e.target.value)}  
            /> 
          </div> 

          <div className="input-block">  
            <label htmlFor="avatar_url">  Avatar Url </label>
            <input 
              name="avatar_url" 
              id = "avatar_url"
              required
              value = {avatar_url}
              onChange={e => setAvatarUrl(e.target.value)}  
            /> 
          </div> 

          <div className="input-block">  
            <label htmlFor="specs"> Especialidades </label>
            <input 
              name="specs" 
              id = "specs"
              required
              maxlength="70"
              value = {specs}
              onChange={e => setSpecs(e.target.value)}  
            /> 
          </div> 

          <div className="input-group">
            <div className="input-block">  
              <label htmlFor="latitude"> Latitude </label>
              <input 
              type="number"
              name="latitude" 
              id="latitude" 
              required 
              value={latitude}
              onChange={e => setLatitude(e.target.value)} />
            </div> 
          </div>

          <div className="input-group">
            <div className="input-block">  
              <label htmlFor="longitude"> Longitude </label>
              <input name="longitude"
               id="longitude"
                required 
                value={longitude}
                onChange={ e=> setLongitude(e.target.value)}/>
            </div> 
          </div>
          

          <button type="submit"> Salvar </button>
          <button type="reset"> Deletar </button>

        </form>
      </aside>
      
      
      <main> 
        <ul>
        {users.map( user =>  (
          <li key={user._id} className="user-item">
            <header>
              <img src={user.avatar_url} alt={user.name}/>
                <div className="user-info">
                  <button className="delete-button" type= {"button"} onClick={(e) => handleDeleteUserById(user)}> X </button>
                  <strong>{user.name}</strong>
                  <span> {user.specs.join(', ')}</span>
              </div>
            </header>
            <p> {user.bio} </p>
            <a href="/src/index.js"> Acessar grupo do whatsapp</a>
          </li>
          ))}
        </ul>      
      </main>
    </div>

  );
}

export default App;
