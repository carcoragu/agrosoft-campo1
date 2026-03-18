function formatearNumero(num){
return Number(num).toLocaleString("es-PY")
}

/* =========================
   CONTROL 30 DIAS
========================= */

function verificarLicencia(){

let inicio = localStorage.getItem("fechaInicio")

if(!inicio){
localStorage.setItem("fechaInicio", Date.now())
return true
}

let dias = (Date.now() - Number(inicio)) / (1000*60*60*24)

if(dias > 30){
document.getElementById("bloqueo").style.display="flex"
return false
}

return true
}

/* ========================= */

let animales=[]
let gastos=[]
let historial=[]

document.getElementById("numeroCompra").value=Date.now()

function calcularCostoReal(totalAnimales,totalGastos,cantidad){
if(cantidad===0) return 0
return (totalAnimales + totalGastos) / cantidad
}

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
</tr>
`
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

let totalGastos=0

gastos.forEach((g,i)=>{

totalGastos+=g.total

tbody.innerHTML+=`
<tr>
<td>${g.numeroCompra}</td>
<td>${g.fecha}</td>
<td>${g.tipo}</td>
<td>${formatearNumero(g.total)}</td>
<td><button onclick="eliminarGasto(${i})">X</button></td>
</tr>
`
})

document.getElementById("totalGastos").innerText=formatearNumero(totalGastos)
document.getElementById("dashTotalGastos").innerText=formatearNumero(totalGastos)

let totalAnimales=animales.reduce((sum,a)=>sum+a.total,0)
let costoReal=calcularCostoReal(totalAnimales,totalGastos,animales.length)

document.getElementById("costoReal").innerText=formatearNumero(Math.round(costoReal))
}

function eliminarGasto(i){
gastos.splice(i,1)
renderGastos()
}

function guardarCompra(){

if(!verificarLicencia()) return

let numero=document.getElementById("numeroCompra").value

let existe=historial.find(h=>h.numero===numero)

if(existe){
alert("⚠️ Ya existe")
return
}

let totalAnimales=animales.reduce((sum,a)=>sum+a.total,0)
let totalGastos=gastos.reduce((sum,g)=>sum+g.total,0)
let costoReal=calcularCostoReal(totalAnimales,totalGastos,animales.length)

let compra={
numero,
fecha:document.getElementById("fechaCompra").value,
proveedor:document.getElementById("proveedor").value,
totalAnimales,
totalGastos,
costoReal:Math.round(costoReal)
}

historial.push(compra)

alert("✅ Guardado correctamente")

document.getElementById("numeroCompra").value=Date.now()
}

function exportarExcel(){

if(!verificarLicencia()) return

let wb1=XLSX.utils.book_new()
let ws1=XLSX.utils.json_to_sheet(historial)
XLSX.utils.book_append_sheet(wb1,ws1,"Compras")
XLSX.writeFile(wb1,"Compras.xls")

let wb2=XLSX.utils.book_new()
let ws2=XLSX.utils.json_to_sheet(animales)
XLSX.utils.book_append_sheet(wb2,ws2,"Animales")
XLSX.writeFile(wb2,"Animales.xls")

let wb3=XLSX.utils.book_new()
let ws3=XLSX.utils.json_to_sheet(gastos)
XLSX.utils.book_append_sheet(wb3,ws3,"Gastos")
XLSX.writeFile(wb3,"Gastos.xls")

alert("📊 Exportado correctamente")
}

window.onload=function(){

if(!verificarLicencia()) return

setTimeout(()=>{
document.getElementById("splash").style.display="none"
},1500)

}
