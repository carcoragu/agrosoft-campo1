function formatearNumero(num){
return Number(num).toLocaleString("es-PY")
}

/* LICENCIA 30 DIAS */
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

document.getElementById("numeroCompra").value=Date.now()

function calcularCostoReal(a,g,c){
if(c===0)return 0
return (a+g)/c
}

function agregarAnimal(){
if(!verificarLicencia())return

let caravana=caravana.value
let peso=Number(peso.value)
let precioKg=Number(precioKg.value)

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
if(!verificarLicencia())return

let numeroCompra=numeroCompra.value
let fecha=fechaGasto.value
let tipo=tipoGasto.value
let cantidad=Number(cantidadGasto.value)
let importe=Number(importeGasto.value)

let total=cantidad*importe

gastos.push({numeroCompra,fecha,tipo,total})
renderGastos()
}

function renderGastos(){
let tbody=document.querySelector("#tablaGastos tbody")
tbody.innerHTML=""
let totalG=0

gastos.forEach((g,i)=>{
totalG+=g.total
tbody.innerHTML+=`
<tr>
<td>${g.numeroCompra}</td>
<td>${g.fecha}</td>
<td>${g.tipo}</td>
<td>${formatearNumero(g.total)}</td>
<td><button onclick="eliminarGasto(${i})">X</button></td>
</tr>`
})

document.getElementById("totalGastos").innerText=formatearNumero(totalG)
document.getElementById("dashTotalGastos").innerText=formatearNumero(totalG)

let totalA=animales.reduce((s,a)=>s+a.total,0)
let costo=calcularCostoReal(totalA,totalG,animales.length)

document.getElementById("costoReal").innerText=formatearNumero(Math.round(costo))
}

function eliminarGasto(i){
gastos.splice(i,1)
renderGastos()
}

function guardarCompra(){
if(!verificarLicencia())return

let numero=numeroCompra.value

if(historial.find(h=>h.numero===numero)){
alert("⚠️ Ya existe")
return
}

let totalA=animales.reduce((s,a)=>s+a.total,0)
let totalG=gastos.reduce((s,g)=>s+g.total,0)
let costo=calcularCostoReal(totalA,totalG,animales.length)

historial.push({
numero,
fecha:fechaCompra.value,
proveedor:proveedor.value,
totalAnimales:totalA,
totalGastos:totalG,
costoReal:Math.round(costo)
})

alert("✅ Guardado")

numeroCompra.value=Date.now()
}

function exportarExcel(){
if(!verificarLicencia())return

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
if(!verificarLicencia())return
setTimeout(()=>splash.style.display="none",1500)
}
