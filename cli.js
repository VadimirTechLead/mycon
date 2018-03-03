
const P2p = require("./P2p.js");
const Blockchain = require("./Blockchain.js");
const blockchain = new Blockchain();
const p2p = new P2p(blockchain);

function cli(vorpal) {
  vorpal
  .use(welcome)
  .use(connectCommand)
  .use(discoverCommand)
  .use(blockchainCommand)
  .use(peersCommand)
  .use(mineCommand)
  .use(openCommand)
  .delimiter('blockchain →')
  .show()
}

module.exports = cli;

// COMMANDS
function welcome(vorpal) {
  vorpal.log("Welcome to Blockchain CLI!");
  vorpal.exec("help");
  // vorpal.log("port 2727");
  // p2p.startServer(2727)
  // vorpal.log("192.168.1.215");
  // p2p.connectToPeer("192.168.1.215", 2727)

}

function connectCommand(vorpal) {
  vorpal
  .command('connect <host> <port>', "Connect to a new peer. Eg: connect localhost 2727")
  .alias('c')
  .action(function(args, callback) {
    if(args.host && args.port) {
      try {
        p2p.connectToPeer(args.host, args.port);
      } catch(err) {
        this.log(err);
      }
    }
    callback();
  })
}

function discoverCommand(vorpal) {
  vorpal
  .command('discover', 'Discover new peers from your connected peers.')
  .alias('d')
  .action(function(args, callback) {
    try {
      p2p.discoverPeers();
    } catch(err) {
      this.log(err);
    }
    callback();
  })
}

function blockchainCommand(vorpal) {
  vorpal
    .command('blockchain', 'See the current state of the blockchain.')
    .alias('bc')
    .action(function(args, callback) {
      this.log(blockchain)
      callback();
    })
}

function peersCommand(vorpal) {
  vorpal
    .command('peers', 'Get the list of connected peers.')
    .alias('p')
    .action(function(args, callback) {
      p2p.peers.forEach(peer => {
        this.log(`${peer.pxpPeer.socket._host} \n`)
      }, this)
      callback();
    })
}

function mineCommand(vorpal) {
  vorpal
    .command('mine <data>', 'Mine a new block. Eg: mine hello!')
    .alias('m')
    .action(function(args, callback) {
      if (args.data) {
        blockchain.mine(args.data);
        p2p.broadcastLatest(); 
      }
      callback();
    })
}

function openCommand(vorpal) {
  vorpal
    .command('open <port>', 'Open port to accept incoming connections. Eg: open 2727')
    .alias('o')
    .action(function(args, callback) {
      if (args.port) {
        if(typeof args.port === 'number') {
          p2p.startServer(args.port);
          this.log(`Listening to peers on ${args.port}`);
        } else {
          this.log(`Invalid port!`);
        }
      }
      callback();
    })
}
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
///////////////////////////////////////

const fs = require("fs");
var express = require('express')
var app = express()
const path = require("path");
const adres = path.resolve(__dirname);
const _ = require("lodash");
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

var multer  = require('multer')
var upload = multer()

const port = 3000;


app.use('/public', express.static('public', options))
app.get('/', function (req, res) {
  console.log(res.connection.localAddress)
  console.log(res.connection.remoteFamily)
  console.log(res.connection._peername)
  var options = {
    root: adres + '/public/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log('Sent:', err);
    } else {
      // console.log('Sent:');
    }
  });
  // res.end();
})
app.get('/*', function(req, res) {
  // console.log(req, res)
  res.send('hello world');
});
app.use(upload.array());
app.post('/*', function(req, res) {
  if (0/* res.req.originalUrl=="/avtor" */) {
    console.log('Sent:')
  } else {
    setBetcoin(res.req.body);
    var options = {
      root: adres + '/public/str/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };
    res.sendFile('index.html', options, function (err) {
      if (err) {
        console.log('Sent:', err);
      } else {
        // console.log('Sent:');
      }
    });
  }

})
app.listen(port)
console.log("сервер запущен на " + port + " порту");
/* получить */
function getBetcoin(params) {
  console.log(params,"getBetcoin")
};
/* отправить */
function setBetcoin(params) {
  let tt= JSON.stringify(params)
  if (!tt) {
    tt=1
    console.log("JSON.stringify eror")
  }
  blockchain.mine(tt);
  p2p.broadcastLatest()
   console.log(params,"setBetcoin")
  // Blockchain.prototype.mine
  // console.log(Blockchain.prototype.mine() )
  // console.log(params.password_login )
  // params.password_login
  //  Blockchain.prototype.mine("12")
  // console.log(typeof Blockchain.prototype.mine )
};