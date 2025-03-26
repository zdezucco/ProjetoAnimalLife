import { useEffect } from 'react'
import './styles/Color.css'

function Color() {
  useEffect(() => {
    document.title = "Testando Variáveis de Cores";
  }, []);

  return (
    <>
      <div className="container">
        <div className="color-card" id='card1'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Background Color Tela de Login</h2>
        </div>

        <div className="color-card" id='card2'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Primary Color</h2>
        </div>

        <div className="color-card" id='card3'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Secondary Color</h2>
        </div>

        <div className="color-card" id='card4'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Attention Color</h2>
        </div>
      </div>
      <div className="container">
        <div className="color-card" id='card5'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Secundary Attention Color</h2>
        </div>

        <div className="color-card" id='card6'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Warning Color</h2>
        </div>

        <div className="color-card" id='card7'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Warning Secundary Color</h2>
        </div>

        <div className="color-card" id='card8'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Healthy Color</h2>
        </div>
      </div>
      <div className="container">
        <div className="color-card" id='card9'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Background Color</h2>
        </div>

        <div className="color-card" id='card10'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Texto Primário</h2>
        </div>

        <div className="color-card" id='card11'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Texto Secundário</h2>
        </div>

        <div className="color-card" id='card12'>
          <span className="card">
            <h3>Isso é um Teste!</h3>
            <p>Uma Cor Misteriosa!</p>
          </span>
          <h2>Background Secundário</h2>
        </div>
      </div>
      <footer>
        <div id="footer_content">
        </div>
      </footer>
    </>
  )
}

export default Color