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

// =========================
// ANIMALES
// =========================
function agregarAnimal(){
if(!verificarLicencia()) return

let caravana=document.getElementById("caravana").value
let peso=Number(document.getElementById("peso").value)
let precioKg=Number(document.getElementById("precioKg").value)
let numeroCompra=document.getElementById("numeroCompra").value

let total=peso*precioKg

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

// =========================
// GASTOS
// =========================
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

// =========================
// GUARDAR COMPRA
// =========================
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
numeroCompra: numero,
fecha:document.getElementById("fechaCompra").value,
proveedor:document.getElementById("proveedor").value,
totalAnimales:totalA,
totalGastos:totalG,
costoReal:Math.round(costo),
animales:[...animales],
gastos:[...gastos]
})

console.log("HISTORIAL:", historial)

alert("✅ Compra guardada correctamente")

// NUEVO NUMERO
document.getElementById("numeroCompra").value = Date.now()

// LIMPIAR
animales=[]
gastos=[]

document.querySelector("#tablaAnimales tbody").innerHTML=""
document.querySelector("#tablaGastos tbody").innerHTML=""

document.getElementById("totalAnimales").innerText="0"
document.getElementById("totalGastos").innerText="0"
document.getElementById("costoReal").innerText="0"
}

// =========================
// EXPORTAR
// =========================
function exportarExcel(){
if(!verificarLicencia()) return

if(historial.length===0){
alert("⚠️ No hay compras")
return
}

console.log("EXPORTANDO HISTORIAL:", historial)

// COMPRAS
let wb1=XLSX.utils.book_new()
let compras=historial.map(h=>({
numeroCompra:h.numeroCompra,
fecha:h.fecha,
proveedor:h.proveedor,
totalAnimales:h.totalAnimales,
totalGastos:h.totalGastos,
costoReal:h.costoReal
}))
XLSX.utils.book_append_sheet(wb1,XLSX.utils.json_to_sheet(compras),"Compras")
XLSX.writeFile(wb1,"Compras.xls")

// ANIMALES
let wb2=XLSX.utils.book_new()
let todosAnimales=[]
historial.forEach(h=>{
(h.animales || []).forEach(a=>{
todosAnimales.push({
numeroCompra:h.numeroCompra,
caravana:a.caravana,
peso:a.peso,
precioKg:a.precioKg,
total:a.total
})
})
})

console.log("ANIMALES:", todosAnimales)

XLSX.utils.book_append_sheet(wb2,XLSX.utils.json_to_sheet(todosAnimales),"Animales")
XLSX.writeFile(wb2,"Animales.xls")

// GASTOS
let wb3=XLSX.utils.book_new()
let todosGastos=[]
historial.forEach(h=>{
(h.gastos || []).forEach(g=>{
todosGastos.push({
numeroCompra:h.numeroCompra,
fecha:g.fecha,
tipo:g.tipo,
total:g.total
})
})
})

console.log("GASTOS:", todosGastos)

XLSX.utils.book_append_sheet(wb3,XLSX.utils.json_to_sheet(todosGastos),"Gastos")
XLSX.writeFile(wb3,"Gastos.xls")

alert("📊 Exportado correctamente")
}

// =========================
// INICIO
// =========================
window.onload=function(){

setTimeout(()=>{
document.getElementById("splash").style.display="none"
},1500)

setTimeout(()=>{
verificarLicencia()
},1600)

// 🔥 CORRECCION CLAVE
document.getElementById("numeroCompra").value = Date.now()

}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
e.preventDefault();
deferredPrompt = e;

// Mostrar botón
let btn = document.getElementById("btnInstalar");
btn.style.display = "block";

btn.onclick = async () => {
deferredPrompt.prompt();
let choice = await deferredPrompt.userChoice;

if(choice.outcome === "accepted"){
console.log("Instalado")
} else {
console.log("Cancelado")
}

deferredPrompt = null;
}
});
