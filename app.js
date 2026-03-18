let animales=[]
let gastos=[]
let historial=[]

document.getElementById("numeroCompra").value=Date.now()

function agregarAnimal(){

let caravana=document.getElementById("caravana").value
let peso=Number(document.getElementById("peso").value)
let precioKg=Number(document.getElementById("precioKg").value)

let total=peso*precioKg

let numeroCompra = document.getElementById("numeroCompra").value

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
<td>${a.peso}</td>
<td>${a.precioKg}</td>
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
<td>${g.total}</td>
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

let numero=document.getElementById("numeroCompra").value

// evitar duplicados
let existe = historial.find(h => h.numero === numero)

if(existe){
alert("⚠️ Esta compra ya está guardada")
return
}

let compra={
numero,
fecha:document.getElementById("fechaCompra").value,
proveedor:document.getElementById("proveedor").value,
total:document.getElementById("totalAnimales").innerText
}

historial.push(compra)

alert("✅ Compra guardada correctamente")

// generar nuevo número automáticamente
document.getElementById("numeroCompra").value = Date.now()

}
function exportarExcel(){

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
}

/* SPLASH */
window.onload=function(){
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},1500)
}

/* INSTALAR AUTOMATICO */
let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{
e.preventDefault();
deferredPrompt=e;

setTimeout(()=>{
if(deferredPrompt){
deferredPrompt.prompt();
}
},2000);
});
