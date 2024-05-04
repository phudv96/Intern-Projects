const express = require('express')
const app = express()

const port = 5000

app.use(express.static('./public'))  

// app.get('/', (req,res)=>{
//     res.sendFile(path.resolve(__dirname, './public'))
// })

// app.all('*', (req, res) => {
//     res.status(404).send('resource not found')
//   })
  
app.listen(port, ()=>{
    console.log(`Server is listening at port ${port}.....`)
})