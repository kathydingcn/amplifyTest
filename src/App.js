// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createProject , deleteProject, updateProject} from './graphql/mutations'
import { getProject, listProjects } from './graphql/queries'
import { withAuthenticator } from '@aws-amplify/ui-react'

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchProjects() {
    try {
      const projects = await API.graphql(graphqlOperation(listProjects))
      // const projects = projectData.data.listProjects.items
      console.log('projects====', projects)
      // setProjects(projects)
    } catch (err) { console.log('error fetching projects', err) }
  }

  async function addProject() {
    try {
      if (!formState.name || !formState.description) return
      const project = { ...formState, stacks:[] }
      setProjects([...projects, project])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createProject, {input: project}))
    } catch (err) {
      console.log('error creating project:', err)
    }
  }

  async function updateTheProject(){
    // await API.graphql(graphqlOperation(createProject, {input: {
    //   // id: '601c69d7-78f3-4025-9f53-874ddafc38b0', 
    //   name: 'gotowork',
    //   loc: 'melbourne', 
    //   description: 'lalal'
    // }}))
    try{
      await API.graphql(graphqlOperation(updateProject, {input: {
        id: '394b9255-d516-4e5e-aa62-4b5849ff7d5f', 
        name: 'new name',
        description: 'new des', 
        
      }}))
    }catch(e){
      console.log('eeee', e)
    }
    
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Projects</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
            <input
        onChange={event => setInput('title', event.target.value)}
        style={styles.input}
        value={formState.title}
        placeholder="Title"
      />
                  <input
        onChange={event => setInput('screen', event.target.value)}
        style={styles.input}
        value={formState.screen}
        placeholder="screen"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addProject}>Create Project</button>
      <button style={styles.button} onClick={updateTheProject}>Update Project</button>
      {
        projects.map((project, index) => (
          <div key={project.id ? project.id : index} style={styles.project}>
            <p style={styles.projectName}>{project.name}</p>
            <p style={styles.projectDescription}>{project.description}</p>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  project: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  projectName: { fontSize: 20, fontWeight: 'bold' },
  projectDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)
