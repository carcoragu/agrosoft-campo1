function formatearNumero(num){
return Number(num).toLocaleString("es-PY")
}

/* LICENCIA */
function verificarLicencia(){
let inicio=localStorage.getItem("inicio")
if(!inicio){
localStorage.setItem("inicio",Date.now())
return true
}
let dias=(Date.now()-inicio)/(1000*60*60*24)
if(dias>30){
document.getElementById("bloqueo").style.display="flex"
return false
}
return true
}

let animales=[]
let gastos=[]
let historial=[]

alert("✅ Compra guardada correctamente")

// 🔥 GENERAR NUEVO NUMERO
document.getElementById("numeroCompra").value = Date.now()

// 🔥 LIMPIAR DATOS (CLAVE)
animales = []
gastos = []

// 🔥 LIMPIAR TABLAS
document.querySelector("#tablaAnimales tbody").innerHTML = ""
document.querySelector("#tablaGastos tbody").innerHTML = ""

// 🔥 RESETEAR TOTALES
document.getElementById("totalAnimales").innerText = "0"
document.getElementById("totalGastos").innerText = "0"
document.getElementById("costoReal").innerText = "0"
document.getElementById("dashAnimales").innerText = "0"
document.getElementById("dashTotalAnimales").innerText = "0"
document.getElementById("dashTotalGastos").innerText = "0"

function agregarAnimal(){
if(!verificarLicencia()) return

let caravana=document.getElementById("caravana").value
let peso=Number(document.getElementById("peso").value)
let precioKg=Number(document.getElementById("precioKg").value)

let total=peso*precioKg
let numeroCompra=document.getElementById("numeroCompra").value

animales.push({numeroCompra,caravana,peso,precioKg,total})
renderAnimales()
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
<td>${formatearNumero(a.peso)}</td>
<td>${formatearNumero(a.precioKg)}</td>
<td>${formatearNumero(a.total)}</td>
<td><button onclick="eliminarAnimal(${i})">X</button></td>
</tr>`
})

document.getElementById("totalAnimales").innerText=formatearNumero(total)
document.getElementById("dashAnimales").innerText=animales.length
document.getElementById("dashTotalAnimales").innerText=formatearNumero(total)

renderGastos()
}

function eliminarAnimal(i){
animales.splice(i,1)
renderAnimales()
}

function agregarGasto(){
if(!verificarLicencia()) return

let numeroCompra=document.getElementById("numeroCompra").value
let fecha=document.getElementById("fechaGasto").value
let tipo=document.getElementById("tipoGasto").value
let cantidad=Number(document.getElementById("cantidadGasto").value)
let importe=Number(document.getElementById("importeGasto").value)

let total=cantidad*importe

gastos.push({numeroCompra,fecha,tipo,total})
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
<td>${g.numeroCompra}</td>
<td>${g.fecha}</td>
<td>${g.tipo}</td>
<td>${formatearNumero(g.total)}</td>
<td><button onclick="eliminarGasto(${i})">X</button></td>
</tr>`
})

document.getElementById("totalGastos").innerText=formatearNumero(total)
document.getElementById("dashTotalGastos").innerText=formatearNumero(total)

let totalA=animales.reduce((s,a)=>s+a.total,0)
let costo=(totalA+total)/animales.length || 0

document.getElementById("costoReal").innerText=formatearNumero(Math.round(costo))
}

function eliminarGasto(i){
gastos.splice(i,1)
renderGastos()
}

function guardarCompra(){
if(!verificarLicencia()) return

let numero=document.getElementById("numeroCompra").value

if(historial.find(h=>h.numeroCompra===numero)){
alert("⚠️ Ya existe")
return
}

let totalA=animales.reduce((s,a)=>s+a.total,0)
let totalG=gastos.reduce((s,g)=>s+g.total,0)
let costo=(totalA+totalG)/animales.length || 0

historial.push({
numeroCompra: numero,   // 👈 CAMBIO CLAVE
fecha:document.getElementById("fechaCompra").value,
proveedor:document.getElementById("proveedor").value,
totalAnimales:totalA,
totalGastos:totalG,
costoReal:Math.round(costo)
})
  
alert("✅ Compra guardada correctamente")

// 🔥 NUEVO NUMERO
document.getElementById("numeroCompra").value = Date.now()

// 🔥 LIMPIAR ARRAYS
animales = []
gastos = []

// 🔥 LIMPIAR TABLAS
document.querySelector("#tablaAnimales tbody").innerHTML = ""
document.querySelector("#tablaGastos tbody").innerHTML = ""

// 🔥 LIMPIAR CAMPOS 👇 (AQUÍ VA)
document.getElementById("caravana").value=""
document.getElementById("peso").value=""
document.getElementById("precioKg").value=""
document.getElementById("cantidadGasto").value=""
document.getElementById("importeGasto").value=""
}

function exportarExcel(){
if(!verificarLicencia()) return

if(historial.length===0){
alert("⚠️ No hay compras")
return
}

let wb1=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb1,XLSX.utils.json_to_sheet(historial),"Compras")
XLSX.writeFile(wb1,"Compras.xls")

let wb2=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb2,XLSX.utils.json_to_sheet(animales),"Animales")
XLSX.writeFile(wb2,"Animales.xls")

let wb3=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb3,XLSX.utils.json_to_sheet(gastos),"Gastos")
XLSX.writeFile(wb3,"Gastos.xls")

alert("📊 Exportado correctamente")
}

window.onload=function(){

setTimeout(()=>{
document.getElementById("splash").style.display="none"
},1500)

setTimeout(()=>{
verificarLicencia()
},1600)

}
