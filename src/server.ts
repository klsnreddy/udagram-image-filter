import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response) => {
    if (!req.query || !req.query.image_url) {
      res.status(400).send({ message: 'image_url is required' });
    }
    
    const image_url = req.query.image_url
    console.log(`Image url : ${image_url}`)

    filterImageFromURL(image_url).then(function(local_path) {
      console.log(`Local path : ${local_path}`);
      res.sendFile(local_path);
      res.on('finish', function() {
        deleteLocalFiles([local_path]).catch(e => {
          console.error(`error removing {}`, local_path); 
        })
      });
    }).catch(function(e) {
      console.error(`Exception while filtering image ${e}`)
      res.status(422).send({message: 'Exception while image filtering'})
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
