//loading nodejs basic module
const fs = require('fs')

// loading 'express' module
const express = require('express')

// loading 'socket.io' module
const socket = require('socket.io')

// loading nodejs basic module
const http = require('http')

// create express object
const app = express();

// create express http server
const server = http.createServer(app)

//binding server in socker.io
const io = socket(server)

app.use('/css', express.static('./static/css')) //css파일을 쓸것이다
app.use('/js', express.static('./static/js'))
app.use('/img', express.static('./static/img'))

// '/'경로에 접속 했을 때 ((get 방식임))
app.get('/', function(request, response) {
  fs.readFile('./static/first_page.html', function(err, data) { //first_page.html파일 받아옴
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

// 이름 입력하는 페이지
app.get('/start', function(request, response) {
  fs.readFile('./static/start.html', function(err, data) { //start.html파일 받아옴
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

// 채팅 페이지
app.get('/main', function(request, response) {
  fs.readFile('./static/index.html', function(err, data) { //index.html파일 받아옴
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

io.sockets.on('connection', function(socket) {
  // 새로운 유저가 접속 시 알려줌
  socket.on('newUser', function(name) {
    console.log(name + ' 님이 접속하였습니다.')

    // 소켓에 이름 저정해두기
    socket.name = name

    // 모든 소켓에 전송
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
  })

  // 전송한 메시지 받기
  socket.on('message', function(data) {
    //누가 보낸 데이터인지
    data.name = socket.name

    // 보낸메시지를 제외하고 다른 사람에게 메시지 전송
    socket.broadcast.emit('update', data);
  })

  // 접속 종료
  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')

    // 나간 사람을 제외한
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  })
})

// 서버 주소 8084 !!!!
server.listen(8084, function() {
  console.log('서버 실행 중..')
})
