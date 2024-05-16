<script>
    const videos = [
      {
        name: 'Raúl Sequera Gomez (rauseqgom)',
        youtubeUrl: 'https://youtu.be/uXYLEhhQncc'
      },
      {
        name: 'Pedro Heredia Torres (pedhertor)',
        youtubeUrl: 'https://youtu.be/7bobPvHLR2A'
      },
      {
        name: 'Alberto Fraile Infantes (albfrainf)',
        youtubeUrl: 'https://youtu.be/mNeKqj4juKQ'
      },
      {
        name: 'Jose Manuel Peña Ramírez (jpenrrami)',
        youtubeUrl: 'URL_DEL_VIDEO_4'
      }
    ];
  </script>
  
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
  
    ul {
      list-style-type: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
  
    li {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
  
    li:hover {
      transform: translateY(-5px);
    }
  
    a {
      display: block;
      padding: 10px;
      text-decoration: none;
      color: #333;
    }
  
    a:hover {
      background-color: #f9f9f9;
    }
  </style>
  
  <h1 style="text-align: center;">Vídeos</h1>
  
  <ul>
    {#each videos as { name, youtubeUrl }}
      <li>
        <a href={youtubeUrl} target="_blank">
          <p style="text-align: center;">{name}</p>
        </a>
      </li>
    {/each}
  </ul>
  