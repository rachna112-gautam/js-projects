const fs = require('fs');
const http = require('http');
const url = require('url');
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    
    const pathname = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    console.log(pathname);

    //PRODUCT DETAILS
    if(pathname === '/products' || pathname === '/'){
        res.writeHead(200, { 'content-type' : 'text/html'});
        fs.readFile(`${__dirname}/templates/temp-overview.html`, 'utf-8', (err, data) => {
            let ovOutput = data; 
           
            fs.readFile(`${__dirname}/templates/temp-cards.html`, 'utf-8', (err, data) => {
                  
                const cardsOp = laptopData.map(el => 
                     replaceTemp(data, el)).join('');
                 
                ovOutput = ovOutput.replace('{%CARD%}', cardsOp);
                res.end(ovOutput);
    
              }); 

          }); 
    }
    //LAPTOP DETAILS
    else if(pathname === '/laptop' && id < laptopData.  length){
        res.writeHead(200, { 'content-type' : 'text/html'});
          fs.readFile(`${__dirname}/templates/temp-laptop.html`, 'utf-8', (err, data) => {
            const lp = laptopData[id];    
            let output = replaceTemp(data, lp);
            res.end(output);


          }); 
     }
       //IMAGES
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathname)){
        fs.readFile(`${__dirname}/data/img${pathname}`, (err, data) => {
            res.writeHead(200, { 'content-type': 'image/jpg' });
            res.end(data);
        })
    }
     
    else {
        res.writeHead(404, { 'content-type' : 'text/html'});
        res.end('Url not found');
    }
    
    
});

server.listen(1447, '127.0.0.1', () => {
    console.log('Listening for request now');
});

function replaceTemp(originalHtml, lp){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, lp.productName);
            output = output.replace(/{%IMAGE%}/g, lp.image);
            output = output.replace(/{%PRICE%}/g, lp.price);
            output = output.replace(/{%SCREEN%}/g, lp.screen);
            output = output.replace(/{%CPU%}/g, lp.cpu);
            output = output.replace(/{%STORAGE%}/g, lp.storage);
            output = output.replace(/{%RAM%}/g, lp.ram);
            output = output.replace(/{%DESCRIPTION%}/g, lp.description);
            output = output.replace(/{%ID%}/g, lp.id);
    return output;
}

