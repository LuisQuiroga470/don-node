const pedidoModel = require('../models/pedidoModel');

function registrarPedidos(req, res) {

    const {
        nombre,
        tamaño,
        jamon,
        quesoextra,
        champiñones,
        aceitunas,
        cebolla,
        tocino,
        cantidad
    } = req.body;

    // PRECIOS SEGÚN TAMAÑO
    let precioBase = 0;
    let valorExtra = 0;

    if (tamaño === "chica") {
        precioBase = 3990;
        valorExtra = 500;
    }

    else if (tamaño === "mediana") {
        precioBase = 5990;
        valorExtra = 800;
    }

    else if (tamaño === "grande") {
        precioBase = 8490;
        valorExtra = 1200;
    }

    // INGREDIENTES
    const ingredientes = [];

    if (jamon) ingredientes.push("Jamón");
    if (quesoextra) ingredientes.push("Queso Extra");
    if (champiñones) ingredientes.push("Champiñones");
    if (aceitunas) ingredientes.push("Aceitunas");
    if (cebolla) ingredientes.push("Cebolla");
    if (tocino) ingredientes.push("Tocino");

    // CONTAR INGREDIENTES
    const cantidadIngredientes = ingredientes.length;

    // INGREDIENTES EXTRA
    let ingredientesExtra = 0;

    if (cantidadIngredientes > 3) {
        ingredientesExtra = cantidadIngredientes - 3;
    }

    // PRECIO UNITARIO
    const precioUnitario =
        precioBase + (ingredientesExtra * valorExtra);

    // TOTAL
    const total =
        precioUnitario * Number(cantidad);

    // OBJETO PEDIDO
    const pedido = {
        nombre,
        tamaño,
        ingredientes,
        precioUnitario,
        cantidad: Number(cantidad),
        total
    };

    // GUARDAR
    pedidoModel.guardar(pedido);

    // REDIRECCIONAR
    res.redirect('/pedidos/lista');
}

function listarPedidos(req, res) {

    const pedidos = pedidoModel.obtenerTodos();

    const totalGeneral = pedidos.reduce(
        (acc, p) => acc + p.total,
        0
    );

    const filas = pedidos.map(n => `
        <tr>
            <td>${n.nombre}</td>
            <td>${n.tamaño}</td>
            <td>${n.ingredientes.join(", ")}</td>
            <td>$${n.precioUnitario}</td>
            <td>${n.cantidad}</td>
            <td>$${n.total}</td>
        </tr>
    `).join('');

    res.send(`
        <h1>Lista de Pedidos</h1>

        ${pedidos.length === 0
            ? '<p>SIN PEDIDOS</p>'
            : `
            <table border="1">
                
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tamaño</th>
                        <th>Ingredientes</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="5">
                            <strong>Total acumulado</strong>
                        </td>

                        <td>
                            <strong>$${totalGeneral}</strong>
                        </td>
                    </tr>
                </tfoot>

            </table>
            `
        }

        <br><br>

        <a href="/">Volver al formulario</a>
    `);
}

module.exports = {
    registrarPedidos,
    listarPedidos
};