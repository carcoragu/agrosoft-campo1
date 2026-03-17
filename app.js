let animales=[]
let gastos=[]
let historial=[]

document.getElementById("numeroCompra").value=Date.now()

function agregarAnimal(){

let caravana=document.getElementById("caravana").value
let peso=Number(document.getElementById("peso").value)
let precioKg=Number(document.getElementById("precioKg").value)
let precioAnimal=Number(document.getElementById("precioAnimal").value)

let total=precioAnimal || peso*precioKg

animales.push({caravana,peso,precioKg,precioAnimal,total})

renderAnimales()

}

/* SPLASH */

#splash{

position:fixed;
top:0;
left:0;

width:100%;
height:100%;

background:#2e7d32;

display:flex;
flex-direction:column;
align-items:center;
justify-content:center;

color:white;

z-index:9999;

transition:opacity 0.6s;

}

.logoSplash{

width:120px;
margin-bottom:20px;

}

function renderAnimales(){

let tbody=document.querySelector("#tablaAnimales tbody")
tbody.innerHTML=""

let total=0

animales.forEach((a,i)=>{

total+=a.total

tbody.innerHTML+=`

<tr>
<td>${a.caravana}</td>
<td>${a.peso}</td>
<td>${a.precioKg}</td>
<td>${a.precioAnimal}</td>
<td>${a.total}</td>
<td><button onclick="eliminarAnimal(${i})">X</button></td>
</tr>

`

})

document.getElementById("totalAnimales").innerText=total

document.getElementById("dashAnimales").innerText=animales.length
document.getElementById("dashTotalAnimales").innerText=total

}

function eliminarAnimal(i){

animales.splice(i,1)
renderAnimales()

}

function agregarGasto(){

let fecha=document.getElementById("fechaGasto").value
let tipo=document.getElementById("tipoGasto").value
let cantidad=Number(document.getElementById("cantidadGasto").value)
let importe=Number(document.getElementById("importeGasto").value)
let obs=document.getElementById("obsGasto").value

let total=cantidad*importe

gastos.push({fecha,tipo,total,obs})

renderGastos()

}

function renderGastos(){

let tbody=document.querySelector("#tablaGastos tbody")
tbody.innerHTML=""

let total=0

gastos.forEach((g,i)=>{

total+=g.total

tbody.innerHTML+=`

<tr>
<td>${g.fecha}</td>
<td>${g.tipo}</td>
<td>${g.total}</td>
<td>${g.obs}</td>
<td><button onclick="eliminarGasto(${i})">X</button></td>
</tr>

`

})

document.getElementById("totalGastos").innerText=total
document.getElementById("dashTotalGastos").innerText=total

}

function eliminarGasto(i){

gastos.splice(i,1)
renderGastos()

}

function guardarCompra(){

let compra={

numero:document.getElementById("numeroCompra").value,
fecha:document.getElementById("fechaCompra").value,
proveedor:document.getElementById("proveedor").value,
total:document.getElementById("totalAnimales").innerText

}

historial.push(compra)

renderHistorial()

}

function renderHistorial(){

let tbody=document.querySelector("#tablaHistorial tbody")
tbody.innerHTML=""

historial.forEach(h=>{

tbody.innerHTML+=`

<tr>
<td>${h.numero}</td>
<td>${h.fecha}</td>
<td>${h.proveedor}</td>
<td>${h.total}</td>
</tr>

`

})

}

function exportarExcel(){

let wb1=XLSX.utils.book_new()
let ws1=XLSX.utils.json_to_sheet(historial)
XLSX.utils.book_append_sheet(wb1,ws1,"Compras")
XLSX.writeFile(wb1,"Compras.xls")

let wb2=XLSX.utils.book_new()
let ws2=XLSX.utils.json_to_sheet(animales)
XLSX.utils.book_append_sheet(wb2,ws2,"Animales")
XLSX.writeFile(wb2,"DetalleAnimales.xls")

let wb3=XLSX.utils.book_new()
let ws3=XLSX.utils.json_to_sheet(gastos)
XLSX.utils.book_append_sheet(wb3,ws3,"Gastos")
XLSX.writeFile(wb3,"Gastos.xls")

}

function forzarVistaEscritorio(){

if(window.innerWidth < 900){

document.body.style.minWidth = "1200px"

}

}

window.onload = function(){

forzarVistaEscritorio()

}

function ajustarVista(){

let ancho = window.innerWidth

if(ancho < 900){

document.body.style.maxWidth = "900px"
document.body.style.margin = "auto"

}

}

window.addEventListener("load", ajustarVista)
window.addEventListener("resize", ajustarVista)
