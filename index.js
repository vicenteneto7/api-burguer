const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json())

const orders = []


const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "user not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/order', (request, response) => {
    return response.status(201).json(orders)
})

app.get('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    return response.status(201).json(orders[index])
})

app.post('/order', (request, response) => {
    const { order, clientName, price } = request.body
    const orderPlaced = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(orderPlaced)

    return response.status(201).json(orderPlaced)
})

app.put('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const { clientName, order, price } = request.body

    const orderUpdate = { id, order, clientName, price, status: "Em preparação" }

    orders[index] = orderUpdate

    return response.status(201).json(orderUpdate)
})

app.delete('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const orderDelete = { id }

    orders.splice(index, 1)


    return response.status(201).json(orderDelete)

})

app.patch('/order/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    orders[index].status = "Pronto"

    return response.status(201).json(orders[index])
})

app.listen(port, () => {
    console.log(`server started on ${port}`)
})