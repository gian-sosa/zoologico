// Diagramas vectoriales propios. No requiere bibliotecas de diagramación.
// Ejecutar desde la raíz: node docs/img/fuentes/generar-diagramas.mjs
// Exporta SVG editables y PNG mediante Chrome (CHROME_PATH permite otra ruta).
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const colors = {
  green: ['#166534', '#edf5eb', '#bed3c0'],
  blue: ['#2563eb', '#edf3fd', '#c3d3ee'],
  amber: ['#b45309', '#fff4e1', '#ecd4ad'],
  gray: ['#536459', '#f1f3ee', '#d6ddd3'],
  red: ['#b23c35', '#fff0ed', '#e9c4be'],
}
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const wrap = (value, width, size) => {
  const lines = []
  for (const para of String(value).split('\n')) {
    let line = ''
    for (const word of para.split(' ')) {
      if (line && (line.length + word.length + 1) * size * .53 > width) { lines.push(line); line = word }
      else line += (line ? ' ' : '') + word
    }
    lines.push(line)
  }
  return lines
}

class Diagram {
  constructor(name, section, title, subtitle, footer, height = 1080) {
    this.name = name; this.height = height; this.parts = []; this.edges = []; this.count = 0
    this.text(80, 77, 'ZOOLÓGICO LA TOTORILLA · ' + section.toUpperCase(), 20, '#166534', 700, 'start', 3)
    this.text(80, 150, title, title.length > 57 ? 46 : 54, '#1c241e', 700)
    this.text(80, 202, subtitle, 26, '#536459')
    this.parts.push(`<path d="M80 ${height - 91}H1840" stroke="#dce3d8"/>`)
    this.lines(80, height - 53, footer, 1760, 20, '#536459', 28)
  }
  text(x, y, value, size = 24, fill = '#1c241e', weight = 400, anchor = 'start', spacing = 0) {
    this.parts.push(`<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${esc(value)}</text>`)
  }
  lines(x, y, value, width, size = 23, fill = '#536459', lh = 33, weight = 400) {
    const lines = Array.isArray(value) ? value : wrap(value, width, size)
    lines.forEach((line, i) => this.text(x, y + i * lh, line, size, fill, weight))
    return lines.length * lh
  }
  band(x, y, w, title, subtitle = '', tone = 'green', h = 92) {
    const [c, bg, border] = colors[tone]
    this.parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${bg}" stroke="${border}"/>`)
    this.text(x + 28, y + (subtitle ? 36 : h / 2 + 8), title, 24, c, 600)
    if (subtitle) this.text(x + 28, y + 69, subtitle, 21, '#536459')
  }
  card(x, y, w, h, label, title, body = '', tone = 'green', chip = '') {
    const [c, bg, border] = colors[tone]
    const id = `card-${++this.count}`
    this.parts.push(`<g id="${id}" data-card="${x},${y},${w},${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="white" stroke="${border}" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="7" rx="3" fill="${c}"/>`)
    const compact = h <= 245
    this.text(x + 28, y + (compact ? 35 : 43), label.toUpperCase(), compact ? 16 : 18, c, 700, 'start', compact ? 1 : 1.5)
    const size = compact ? 26 : w < 360 ? 28 : 30
    const titleY = y + (compact ? 76 : 88)
    const titleHeight = this.lines(x + 28, titleY, title, w - 56, size, '#1c241e', compact ? 32 : 36, 700)
    if (body) {
      const start = titleY + titleHeight + (compact ? -7 : 8)
      this.parts.push(`<path d="M${x+28} ${start-16}H${x+w-28}" stroke="#e4e8df"/>`)
      this.lines(x + 28, start + 19, body, w - 56, compact ? 21 : 23, '#536459', compact ? 29 : 33)
    }
    if (chip) {
      this.parts.push(`<rect x="${x+28}" y="${y+h-58}" width="${w-56}" height="36" rx="11" fill="${bg}"/>`)
      this.text(x+w/2, y+h-33, chip, 19, c, 600, 'middle')
    }
    this.parts.push('</g>')
    return {x,y,w,h,cx:x+w/2,cy:y+h/2}
  }
  arrow(points, label = '', tone = 'blue', dashed = false, labelPosition) {
    const d = points.map(([x,y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
    const c = colors[tone][0]
    this.edges.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" ${dashed ? 'stroke-dasharray="9 7"' : ''} marker-end="url(#${tone})"/>`)
    if (label) {
      const [x,y] = labelPosition ?? [(points[0][0]+points.at(-1)[0])/2, (points[0][1]+points.at(-1)[1])/2 - 18]
      const lines = label.split('\n'), w = Math.max(...lines.map(l=>l.length))*11.8+24
      this.edges.push(`<rect x="${x-w/2}" y="${y-23}" width="${w}" height="${lines.length*29+8}" rx="8" fill="#faf8f1"/>`)
      lines.forEach((line,i)=>this.edges.push(`<text x="${x}" y="${y+i*29}" font-size="21" font-weight="600" fill="${c}" text-anchor="middle">${esc(line)}</text>`))
    }
  }
  svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${this.height}" viewBox="0 0 1920 ${this.height}" role="img" aria-labelledby="title"><title id="title">${esc(this.name)}</title><defs>${Object.entries(colors).map(([name,[color]])=>`<marker id="${name}" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`).join('')}<style>text{font-family:'Segoe UI',Arial,sans-serif}</style></defs><rect width="1920" height="${this.height}" fill="#faf8f1"/><rect width="1920" height="12" fill="#166534"/>${this.edges.join('')}${this.parts.join('')}</svg>`
  }
}
const diagrams = []
const make = (...args) => { const d = new Diagram(...args); diagrams.push(d); return d }

function pipeline(name, section, title, subtitle, items, result, footer, feedback = '') {
  const d = make(name, section, title, subtitle, footer)
  const n = items.length, gap = n === 3 ? 160 : 72, w = (1760 - (n-1)*gap)/n, y = 345, h = 390
  const cards = items.map((item,i)=>d.card(80+i*(w+gap),y,w,h,item[0],item[1],item[2],item[3]??'green',item[4]??''))
  for(let i=0;i<n-1;i++) d.arrow([[cards[i].x+w+8,535],[cards[i+1].x-12,535]])
  d.band(80, 835, 1760, result[0], result[1], result[2]??'green', 100)
  if(feedback) d.arrow([[cards.at(-1).cx,735],[cards.at(-1).cx,788],[cards[0].cx,788],[cards[0].cx,735]],feedback,'amber',true,[960,783])
  return d
}

// 01 · Análisis del sistema
{
  const d=make('01-actores-1','Análisis · Actores','Personas, plataforma y servicios','Cada actor persigue un objetivo; los proveedores aportan capacidades técnicas.','El personal técnico configura proveedores y permisos. Una misma persona puede desempeñar varios roles.')
  const ys=[275,505,735]
  const left=[['Público','Visitante y remitente','Consulta, aprende y presenta documentos.'],['Personal','Administrador','Gestiona tarifas y revisa contenido privado.'],['Operación','Responsable técnico','Configura servicios y ejecuta mantenimiento.']]
  const right=[['Identidad','Supabase Auth','Sesiones anónimas y Google institucional.'],['Persistencia','Datos y archivos','PostgreSQL con RLS y Storage privado.'],['Comunicación','Resend','Copia por correo de las reclamaciones.']]
  left.forEach((a,i)=>{d.card(80,ys[i],440,210,...a,i===1?'blue':'green');d.arrow([[520,ys[i]+105],[610,ys[i]+105],[610,595],[690,595]],'','green')})
  d.card(700,455,520,280,'Sistema propio','Plataforma La Totorilla','Información, educación, Comunidad, Mesa de Partes y reclamaciones.','blue')
  right.forEach((a,i)=>{d.card(1400,ys[i],440,210,...a,i===2?'amber':'green');d.arrow([[1220,595],[1310,595],[1310,ys[i]+105],[1390,ys[i]+105]],'',i===2?'amber':'green')})
}
{
  const d=make('02-historias-del-usuario-1','Análisis · Historias de usuario','Cinco objetivos que organizan el sistema','Las 14 historias describen necesidades del visitante, del consumidor y del personal.','La consulta es pública; presentar archivos requiere sesión. Registrar una reclamación no exige una cuenta.')
  d.band(80,265,1760,'Necesidades del usuario → funcionalidades verificables','El alcance se conecta con criterios de aceptación y requisitos funcionales.')
  const items=[['HU01–HU04','Informarse y aprender','Horarios y tarifas\nMapa y fichas\nSonidos y cuestionarios','green'],['HU05–HU06','Participar','Enviar fotografías\nSolicitar retirada\nEsperar moderación','green'],['HU07–HU09','Administrar','Acceso del personal\nModificar tarifas\nAprobar fotografías','blue'],['HU10–HU11','Presentar documentos','Mesa de Partes\nPDF opcional\nRevisión privada','blue'],['HU12–HU14','Ejercer derechos','Registrar hoja\nImprimir constancia\nConsultar bandeja','amber']]
  items.forEach((a,i)=>{const x=80+i*360;d.card(x,440,320,370,...a);d.arrow([[x+160,357],[x+160,428]],'',a[3])})
  d.band(80,865,1760,'Un sistema con permisos distintos','Las historias no implican venta de entradas, CMS de especies ni respuestas administrativas automáticas.','gray')
}
{
  const d=make('03-requisitos-funcionales-1','Análisis · Requisitos funcionales','De una fotografía enviada a una publicación','Flujo representativo: recepción, autorización, revisión y resultado visible.','RF10 y RF14: el propietario solicita la retirada; el personal decide. No existe eliminación pública automática.')
  const a=d.card(80,355,380,350,'RF09 · Recepción','Recibir fotografía','Sesión válida\nWebP procesado\nReserva de cuota','green','Estado: pending')
  const b=d.card(620,355,380,350,'RF11 · Seguridad','Comprobar al personal','Verificar token\nComprobar membresía\nAutorizar la acción','blue','Solo personal autorizado')
  const c=d.card(1160,355,380,350,'RF13 · Moderación','Aprobar o rechazar','Comprobar estado\nGuardar revisor\nRegistrar la fecha','blue','Decisión controlada')
  d.arrow([[a.x+a.w+8,530],[b.x-12,530]],'Validar')
  d.arrow([[b.x+b.w+8,530],[c.x-12,530]],'Revisar')
  d.card(1620,300,220,225,'RF08','Publicada','Visible en el muro.','green')
  d.card(1620,620,220,225,'Resultado','Rechazada','Fuera del muro.','red')
  d.arrow([[1540,455],[1580,455],[1580,410],[1608,410]],'','green')
  d.arrow([[1540,615],[1580,615],[1580,730],[1608,730]],'','red')
  d.band(80,845,1460,'La subida no equivale a publicación','El muro público consulta únicamente fotografías aprobadas con estado published.')
}
{
  const d=make('04-atributos-de-calidad-1','Análisis · Calidad','Mecanismos que sostienen la calidad','Los atributos se defienden con evidencia, pruebas y condiciones de medición.','Los mecanismos de diseño no equivalen a un SLA, seguridad absoluta ni certificación de accesibilidad.')
  d.band(80,270,1760,'Calidad observable en La Totorilla','Seguridad e integridad protegen la información; rendimiento y accesibilidad facilitan la visita.')
  const items=[['Seguridad','Identidad y permisos','Token verificado\nMembresía explícita\nPolíticas RLS','green'],['Integridad','Datos consistentes','Claves únicas\nCuotas atómicas\nEstados controlados','blue'],['Rendimiento','Recursos eficientes','CDN y rutas lazy\nImágenes WebP\nDatos estáticos','green'],['Accesibilidad','Uso inclusivo','Teclado y foco\nFormularios claros\nMovimiento reducido','blue'],['Mantenimiento','Cambios verificables','Módulos cohesionados\nPruebas Node y SQL\nScripts operativos','amber']]
  items.forEach((a,i)=>{const x=80+i*360;d.card(x,440,320,370,...a);d.arrow([[x+160,370],[x+160,428]],'',a[3])})
  d.band(80,865,1760,'Verificar → medir → registrar evidencia','Disponibilidad, escalabilidad y operación se evalúan con los escenarios de calidad.','gray')
}
pipeline('05-restricciones-1','Análisis · Restricciones','Fronteras de configuración y confianza','El navegador recibe configuración pública; las credenciales privilegiadas permanecen en el servidor.',[
  ['Cliente','Bundle del navegador','Variables VITE públicas\nSDK de Supabase\nNunca service_role','green','Entorno no confiable'],
  ['Servidor','Funciones Node','Variables privadas\nValidación de entradas\nAutorización por operación','blue','Credenciales solo aquí'],
  ['Proveedor','Supabase','Auth, datos y archivos\nRLS para cliente público\nIntegridad y cuotas SQL','green','Persistencia gestionada'],
],['Dos caminos de acceso','El cliente consulta Supabase con RLS; las operaciones sensibles pasan por las API con permisos comprobados.'],'Las flechas indican el recorrido de una operación sensible. Las consultas públicas también acceden directamente a Supabase.')
pipeline('06-driver-arquitectonicos-1','Análisis · Drivers','De una necesidad a una decisión verificable','Los drivers conectan necesidades del zoológico con decisiones de estructura y tecnología.',[
  ['01 · Origen','Necesidad o riesgo','Información pública\nPrivacidad\nArchivos no confiables'],
  ['02 · Requisitos','HU · RF · AC · RC','Historias y funciones\nCalidad esperada\nRestricciones'],
  ['03 · Impacto','Driver DA','Seleccionar necesidades\nque condicionan\nla arquitectura','blue'],
  ['04 · Decisión','Registro ADR','Evaluar alternativas\nJustificar solución\nAceptar compromisos','blue'],
  ['05 · Evidencia','Código y pruebas','Implementar\nProbar escenarios\nRegistrar resultados','amber'],
],['Trazabilidad de extremo a extremo','La decisión se justifica por un problema real, no por incorporar tecnologías sin necesidad.'],'DA01–DA08 se relacionan con ADR, archivos del repositorio y escenarios de atributos de calidad.')
pipeline('07-decisiones-arquitectonicas-1','Análisis · Decisiones','Las decisiones evolucionan con evidencia','Un ADR registra contexto, alternativas, decisión y consecuencias.',[
  ['Entrada','Driver y riesgo','Identificar el problema\nPriorizar su impacto\nDefinir restricciones'],
  ['Justificación','Registro ADR','Comparar alternativas\nElegir una solución\nExplicar sus costes','blue'],
  ['Aplicación','Implementación','Código del sistema\nPolíticas y permisos\nConfiguración','blue'],
  ['Evaluación','Pruebas y medidas','Comprobar escenarios\nRegistrar resultados\nDetectar nuevos límites','amber'],
],['Ocho decisiones observadas en el repositorio','Cliente-servidor · modularidad · BaaS · permisos · contenido público · archivos · idempotencia · operación.'],'Los ADR documentan decisiones observables. No representan SLA ni aprobaciones institucionales.','Nueva necesidad → revisar el driver')
pipeline('08-escenarios-atributos-calidad-1','Análisis · Escenarios de calidad','Medir antes de afirmar que se cumple','Cada evaluación identifica fuente, estímulo, entorno, respuesta y medida.',[
  ['01 · Preparar','Definir escenario','Fuente y estímulo\nEntorno controlado\nRespuesta esperada'],
  ['02 · Acordar','Aprobar medida','Métrica observable\nUmbral y alcance\nCondiciones de red'],
  ['03 · Ejecutar','Probar el sistema','Datos sintéticos\nCasos positivos\nCasos negativos','blue'],
  ['04 · Conservar','Registrar evidencia','Resultados\nCondiciones\nLimitaciones','blue'],
  ['05 · Evaluar','Comparar objetivo','Cumple: documentar\nNo cumple: ajustar\nRepetir la prueba','amber'],
],['Ocho escenarios para verificar atributos de calidad','Rendimiento, resiliencia, carga, permisos, cambios, idempotencia, accesibilidad y fallos parciales.'],'Las metas propuestas requieren aprobación y medición. No se presentan como resultados ya obtenidos.','Ajustar diseño o configuración y repetir')

// 02 · Arquitectura de software
function architecture(name, title, section, detail = false) {
  const d=make(name,section,title,'SPA en el navegador + funciones Node en Vercel + Supabase como backend gestionado.','Fotos y documentos requieren token. El registro de reclamaciones no exige sesión. Claves privadas: solo en servidor.')
  d.band(540,260,840,'Acceso directo del navegador a Supabase','Auth, consultas, tarifas y URL firmadas con permisos/RLS.')
  d.arrow([[305,385],[305,306],[528,306]],'','green',true)
  d.arrow([[1392,306],[1615,306],[1615,385]],'','green',true)
  d.card(80,395,450,405,'Cliente','React en el navegador','Fichas, mapa y cuestionarios\nComunidad y formularios\nPanel del personal','green','React + TypeScript')
  d.card(735,395,450,405,'Servidor · Vercel','API Node / Serverless','/api/photos · documents · claims\nVerifica sesión y permisos\nValida y procesa archivos','blue','Operaciones sensibles')
  d.card(1390,395,450,405,'Servicios gestionados','Supabase','Auth: sesiones y Google\nPostgreSQL + Data API + RLS\nStorage: WebP y PDF privados','green','Datos, identidad y archivos')
  d.arrow([[542,600],[722,600]],'HTTPS\n+ token*','blue',false,[632,550])
  d.arrow([[1197,600],[1377,600]],'Operaciones\nprivilegiadas','blue',false,[1287,550])
  d.band(80,850,450,'Vercel CDN','Entrega SPA y recursos estáticos.')
  d.band(735,850,450,'Servicio de correo · Resend','Copia de hojas registradas.','amber')
  d.band(1390,850,450,detail?'Datos persistentes':'Fotos con revisión',detail?'Tarifas, fotos, documentos y hojas.':'Pendiente → aprobada → pública.')
  d.arrow([[305,850],[305,810]],'','green')
  d.arrow([[960,800],[960,840]],'','amber')
  return d
}
architecture('arquitectura-inicial-1','Arquitectura global de La Totorilla','Arquitectura · Vista global',true)
pipeline('componentes-arquitectonicos-1','Arquitectura · Componentes','Responsabilidades que colaboran','Las páginas presentan; los servicios coordinan; las API ejecutan operaciones sensibles.',[
  ['Presentación','Páginas y componentes','Interacción del usuario\nFormularios y mensajes\nMapa y contenido'],
  ['Coordinación','Hooks y servicios','Estado de cada función\nConsultas con SDK\nPeticiones HTTP','green'],
  ['Servidor propio','API y helpers','Fotos, documentos y hojas\nValidación y Sharp\nCopia por correo','blue'],
  ['Proveedores','Supabase y Resend','Identidad y persistencia\nArchivos privados\nAceptación de correo','amber'],
],['Consultas directas autorizadas','Los servicios también consultan Supabase con RLS y leen datos educativos estáticos sin pasar por una API propia.'],'La agrupación representa responsabilidades, no procesos independientes ni una API para cada carpeta.')
{
  const d=make('enfoque-aquitectonico-1','Arquitectura · Enfoque modular','Organización por funcionalidades','Una estructura sencilla con responsabilidades explícitas entre navegador y servidor.','Las flechas dentro de un entorno representan imports. La conexión entre servicios y API representa HTTP.')
  d.band(80,265,1760,'Composición y navegación · src/app/','Router, layout, protección del panel y navegación por anclas.')
  d.card(80,440,500,330,'Interfaz','pages/ y components/','Pantallas y piezas reutilizables\nEventos del usuario\nMensajes y accesibilidad','green','Presentación')
  d.card(710,440,500,330,'Funcionalidades','src/features/','Animales · Auth · Comunidad\nTarifas · documentos · reclamos\nDatos, hooks y servicios','green','Coordinación del navegador')
  d.card(1340,440,500,330,'Servidor','api/ y server/','Handlers HTTP\nProcesamiento y autorización\nSharp y correo','blue','Operaciones confiables')
  d.arrow([[330,357],[330,428]],'','green')
  d.arrow([[592,605],[698,605]])
  d.arrow([[1222,605],[1328,605]],'HTTP')
  d.band(80,835,500,'src/shared/','Cliente público y utilidades.')
  d.band(710,835,500,'shared/','Validación común de reclamos.')
  d.band(1340,835,500,'Supabase','Datos, archivos y permisos.')
  d.arrow([[960,770],[960,825]],'','green')
  d.arrow([[850,770],[850,800],[330,800],[330,825]],'','green')
  d.arrow([[1480,770],[1480,810],[1130,810],[1130,825]],'','blue')
  d.arrow([[1590,770],[1590,825]],'','blue')
}
architecture('estilo-arquitectonico-1','Cliente-servidor con servicios gestionados','Arquitectura · Estilo')

// 03 · Diseño interno
{
  const d=make('diseno-interno-de-modulos-1','Diseño · Comunidad','Una fotografía cruza responsabilidades distintas','Del evento de interfaz a una operación validada y almacenada de forma privada.','La lectura del muro usa Data API y URL firmadas con RLS. El envío y la moderación utilizan /api/photos.')
  const items=[['Interfaz','Página y PhotoWall','Selección de imágenes\nInteracción y mensajes'],['Estado','useVisitorPhotos','Carga y paginación\nCoordina cada operación'],['Acceso','photos.store','Sesión y token\nlistPhotos / photoRequest'],['Servidor','api/photos','Permisos y propietario\nReserva y confirmación']]
  items.forEach((a,i)=>d.card(80+i*460,320,380,285,...a,i===3?'blue':'green'))
  for(let i=0;i<3;i++)d.arrow([[472+i*460,460],[528+i*460,460]])
  d.band(80,730,500,'Compresión del navegador','fileToCompressedWebP: original → WebP.')
  d.band(710,730,500,'Procesamiento confiable','sanitizeWebp: recodifica con Sharp.','blue')
  d.band(1340,730,500,'Supabase','Auth, cuota SQL y Storage privado.')
  d.arrow([[730,605],[730,670],[330,670],[330,720]],'','green')
  d.arrow([[1650,605],[1650,660],[960,660],[960,720]],'','blue')
  d.arrow([[1650,605],[1650,720]],'','blue')
  d.band(80,865,1760,'Publicación diferida','La API confirma pending. Solo la aprobación posterior del personal hace que aparezca en el muro.','gray')
}

function sequence(name, section, title, subtitle, participants, messages, footer, notes = []) {
  const height=520+messages.length*96+notes.length*76
  const d=make(name,section,title,subtitle,footer,height)
  const gap=1760/participants.length, xs=participants.map((_,i)=>80+gap*(i+.5))
  participants.forEach((p,i)=>{
    const w=gap-24,x=xs[i]-w/2
    const [tone,label,title]=p
    const [c,bg,border]=colors[tone]
    d.parts.push(`<rect x="${x}" y="265" width="${w}" height="104" rx="18" fill="${bg}" stroke="${border}"/>`)
    d.text(xs[i],298,label,17,c,700,'middle')
    const lines=wrap(title,w-16,22)
    lines.forEach((line,j)=>d.text(xs[i],331+j*26,line,22,'#1c241e',600,'middle'))
    d.edges.push(`<path d="M${xs[i]} 370V${height-120}" stroke="${border}" stroke-width="2" stroke-dasharray="7 8"/>`)
  })
  messages.forEach(([a,b,label,tone='blue',dashed=false],i)=>{
    const y=480+i*96
    d.parts.push(`<circle cx="47" cy="${y-8}" r="17" fill="${colors[tone][1]}"/>`)
    d.text(47,y-2,String(i+1),17,colors[tone][0],700,'middle')
    if(a===b){
      const x=xs[a];d.arrow([[x,y-30],[x+60,y-30],[x+60,y+14],[x+4,y+14]],'',tone,dashed)
      d.lines(x+80,y-15,label,Math.min(540,1810-x-80),20,'#536459',26)
    }else{
      const x1=xs[a],x2=xs[b],center=(x1+x2)/2, w=Math.max(140,Math.abs(x1-x2)-34)
      const lines=wrap(label,w,21)
      const boxWidth=Math.max(...lines.map(l=>l.length))*11.6+22
      d.parts.push(`<rect x="${center-boxWidth/2}" y="${y-lines.length*26-10}" width="${boxWidth}" height="${lines.length*26+6}" rx="7" fill="#faf8f1"/>`)
      lines.forEach((line,j)=>d.text(center,y-(lines.length-j)*26+8,line,21,'#1c241e',500,'middle'))
      d.arrow([[x1,y],[x2+(x1<x2?-5:5),y]],'',tone,dashed)
    }
  })
  notes.forEach((note,i)=>d.band(80,440+messages.length*96+i*76,1760,note,'','amber',60))
  return d
}
sequence('diseno-interno-de-modulos-2','Diseño · Secuencia de fotografías','De la selección a una foto pendiente','La validación del navegador ayuda al usuario; la API vuelve a comprobar el archivo y los permisos.',[
  ['green','PERSONA','Visitante'],['green','INTERFAZ','UI y hook'],['green','CLIENTE','Conversor'],['green','ACCESO','photos.store'],['blue','SERVIDOR','api/photos'],['green','IDENTIDAD','Auth'],['green','DATOS','PostgreSQL'],['green','ARCHIVOS','Storage'],
],[
  [0,1,'Seleccionar originales permitidos'],[1,2,'Comprimir y validar imagen'],[2,1,'WebP hasta 300 KiB','green',true],
  [1,3,'Solicitar envío de fotografía'],[3,5,'Obtener sesión o crear anónima'],[5,3,'Token de sesión','green',true],
  [3,4,'POST WebP + Bearer token'],[4,5,'Verificar identidad con getUser'],[5,4,'Identidad válida','green',true],
  [4,6,'Recodificar con Sharp y reservar uploading'],[4,7,'Subir WebP privado'],[4,6,'Confirmar cambio a pending'],
  [4,1,'201: identificador confirmado','blue',true],[1,0,'Enviada para aprobación','green',true],
],'El recorrido resume la subida. SQL y Storage no comparten una transacción distribuida.',['Todavía no se publica: el personal debe aprobar la foto después de este flujo.'])
{
  const d=make('diseno-interno-de-modulos-3','Diseño · Estados de fotografías','Publicación bajo revisión del personal','Los estados impiden confundir una subida incompleta con una fotografía pública.','deletion_requested es una marca paralela: solicitar la retirada no cambia por sí solo la publicación.')
  d.card(80,300,360,230,'Reserva','uploading','Archivo aún no confirmado.','gray')
  d.card(600,300,360,230,'Recepción','pending','Lista para revisión.','blue')
  d.card(1130,270,360,230,'Aprobación','published','Visible en el muro.','green')
  d.card(1130,590,360,230,'Rechazo','rejected','Fuera del muro.','red')
  d.card(80,730,360,230,'Recuperación','deleting','Retirar objeto y fila.','amber')
  d.card(1650,450,190,230,'Final','Eliminada','Objeto y fila retirados.','gray')
  d.arrow([[452,410],[588,410]],'Confirmar')
  d.arrow([[972,355],[1118,355]],'Aprobar','green')
  d.arrow([[780,530],[780,705],[1118,705]],'Rechazar','red',false,[945,680])
  d.arrow([[260,530],[260,718]],'Reserva antigua','amber',true,[260,635])
  d.arrow([[1310,820],[1310,900],[452,900]],'Eliminar por personal','amber',false,[870,880])
  d.arrow([[1130,460],[1060,460],[1060,845],[452,845]],'','amber')
  d.arrow([[600,480],[500,480],[500,790],[452,790]],'','amber')
  d.arrow([[440,945],[1570,945],[1570,565],[1638,565]],'Objeto eliminado → borrar fila','amber',false,[980,928])
}
pipeline('diseno-interno-de-modulos-4','Diseño · Idempotencia','Reintentar sin duplicar una reclamación','La clave de envío identifica el intento; el hash permite comprobar que los datos sean los mismos.',[
  ['Entrada','POST de hoja','submission_key UUID\nDatos del formulario\nConformidad'],
  ['Reglas','Validar y normalizar','validateClaim\nCampos permitidos\nSHA-256 del contenido','blue'],
  ['Persistencia','Insertar o recuperar','INSERT con clave única\nDuplicada: buscar hoja\nComparar payload_hash','blue'],
  ['Resultado','Conservar evidencia','Hash igual: misma hoja\nDistinto: conflicto 409\nSin sobrescritura','amber'],
],['Después de persistir: solicitar copia por correo','Si Resend falla, la hoja continúa registrada y la copia queda pendiente. No se crea otra hoja por ese fallo.'],'La idempotencia del alta no equivale a entrega garantizada del correo ni numeración sin saltos.')
{
  const d=make('patrones-de-diseno-1','Diseño · Instancia compartida','Un cliente público, reutilizado por módulo','getSupabase() crea la instancia solo cuando existe configuración y hace falta utilizarla.','La instancia pertenece al contexto del módulo en el navegador; no es una conexión global entre todos los usuarios.')
  d.card(80,340,430,370,'Consumidores','Servicios y Auth','Tarifas\nFotografías\nContexto de sesión','green','Mismo cliente público')
  d.card(710,340,500,370,'Función compartida','getSupabase()','¿Existe una instancia?\nSí: devolverla\nNo: comprobar configuración','blue','Inicialización diferida')
  d.card(1410,280,430,245,'Configurado','createClient','Crear y conservar la instancia.','green')
  d.card(1410,650,430,245,'Sin configuración','Devolver null','Cada consumidor informa o usa fallback.','amber')
  d.arrow([[522,525],[698,525]],'Solicitar')
  d.arrow([[1210,435],[1310,435],[1310,400],[1398,400]],'','green')
  d.arrow([[1210,620],[1310,620],[1310,770],[1398,770]],'','amber')
  d.band(80,825,1130,'La clave es pública; los permisos no','La autorización efectiva sigue en RLS y en las comprobaciones de cada API.','gray')
}
sequence('patrones-de-diseno-2','Diseño · Suscripción de Auth','La sesión cambia; la interfaz se actualiza','AuthProvider escucha eventos, comprueba membresía y publica el estado a sus consumidores.',[
  ['green','PROVEEDOR','Supabase Auth'],['blue','CONTEXTO','AuthProvider'],['green','DATOS','photo_admins'],['green','INTERFAZ','useAuth'],
],[
  [1,0,'Suscribir onAuthStateChange'],[0,1,'Notificar cambio de sesión','green',true],
  [1,1,'Diferir consulta fuera del callback de Auth'],[1,2,'Consultar membresía cuando corresponde'],
  [2,1,'Resultado de autorización','green',true],[1,3,'Publicar el nuevo estado del contexto'],
  [1,0,'Al desmontar: cancelar suscripción'],
],'El contexto controla la UI. Las API y RLS vuelven a comprobar los permisos en la operación real.',['Evitar que una respuesta de sesión antigua sobrescriba el estado más reciente.'])
pipeline('principios-de-diseno-1','Diseño · Principios','Separar responsabilidades sin complicar','La composición de funciones y componentes mantiene el flujo comprensible y verificable.',[
  ['Presentación','Interfaz','Recoger acciones\nMostrar información\nComunicar errores'],
  ['Coordinación','Hooks y servicios','Estado de la función\nPreparar peticiones\nReutilizar acceso'],
  ['Seguridad','API Node','Verificar identidad\nAutorizar operaciones\nValidar entradas','blue'],
  ['Especialización','Helpers','Procesar con Sharp\nPreparar correo\nCompartir validación','blue'],
  ['Persistencia','Supabase','Integridad SQL\nPermisos y cuotas\nArchivos privados','green'],
],['Responsabilidades, no un recorrido obligatorio para toda lectura','Las consultas autorizadas y las tarifas mantienen acceso directo a Supabase mediante RLS.'],'Los principios se evalúan sobre componentes y funciones reales, no sobre jerarquías de clases artificiales.')

// 04 · Modelo C4
{
  const d=make('nivel1-contexto','C4 · Nivel 1 · Contexto','La Totorilla en su entorno','Una sola caja para el sistema: quién lo usa y con qué proveedores se relaciona.','Las flechas indican uso. Google autentica cuentas; la membresía del personal se comprueba de forma independiente.')
  d.card(80,330,440,240,'Persona','Público y consumidores','Consulta, aprende, participa\ny presenta documentos o reclamos.','green')
  d.card(80,690,440,240,'Persona','Personal autorizado','Gestiona tarifas y revisa\nregistros privados.','blue')
  d.card(710,440,500,330,'Sistema propio','Plataforma La Totorilla','Información y educación\nFotografías moderadas\nDocumentos y reclamaciones','green','Aplicación web')
  d.card(1400,280,440,180,'Sistema externo','Supabase','Identidad, datos y archivos.','green')
  d.card(1400,530,440,180,'Identidad externa','Google','Login institucional vía Auth.','blue')
  d.card(1400,780,440,180,'Correo externo','Resend','Copia de las hojas registradas.','amber')
  d.arrow([[520,450],[610,450],[610,555],[698,555]],'','green')
  d.arrow([[520,810],[610,810],[610,655],[698,655]],'','blue')
  d.arrow([[1210,545],[1310,545],[1310,370],[1388,370]],'','green')
  d.arrow([[1210,680],[1310,680],[1310,870],[1388,870]],'','amber')
  d.arrow([[1620,460],[1620,518]],'OAuth','blue',false,[1710,500])
}
architecture('nivel2-contenedores','Aplicaciones y servicios del sistema','C4 · Nivel 2 · Contenedores',true)
{
  const d=make('nivel3-componentes','C4 · Nivel 3 · Componentes','Dentro de la API propia','Cada fila detalla un handler y sus colaboradores; los proveedores siguen siendo externos.','Los servicios externos se repiten por fila para facilitar la lectura; no representan instancias o bases independientes.')
  const lanes=[
    ['Fotos','Comunidad','photoRequest','api/photos.mjs','Token y permisos','sanitizeWebp','Sharp: WebP seguro','Supabase','Auth · BD · Storage','green'],
    ['Documentos','Mesa de Partes','saveRequest','api/documents.mjs','Sesión y formulario','Validación PDF','Datos y adjunto opcional','Supabase','Auth · BD · Storage','blue'],
    ['Reclamaciones','Formulario','submitClaim','api/claims.mjs','Clave única + hash','Validación y correo','validateClaim / sendClaimReceipt','Supabase + Resend','Hoja persistida y copia','amber'],
  ]
  lanes.forEach((a,i)=>{
    const y=290+i*230
    d.card(80,y,330,210,'SPA · '+a[0],a[1],a[2],'green')
    d.card(530,y,410,210,'Handler Node',a[3],a[4],'blue')
    d.card(1060,y,330,210,i===1?'Proceso interno':'Helper',a[5],a[6],'blue')
    d.card(1510,y,330,210,'Proveedor externo',a[7],a[8],a[9])
    d.arrow([[422,y+95],[518,y+95]],'HTTP')
    d.arrow([[952,y+95],[1048,y+95]])
    d.arrow([[940,y+170],[990,y+170],[990,y+220],[1675,y+220],[1675,y+211]],'HTTPS',a[9],false,[1445,y+213])
    if(i===2)d.arrow([[1402,y+95],[1498,y+95]],'Correo','amber')
  })
}
{
  const d=make('nivel4-contratos','C4 · Nivel 4 · Contratos','Datos de una hoja de reclamación','Estructuras TypeScript existentes: composición de datos y extensión de contratos.','Los tipos no validan en ejecución: validateClaim comprueba y normaliza los datos antes de persistir.')
  d.card(80,300,490,620,'Type · Entrada','ClaimFields','name · document_type\ndocument_number · address\nemail · is_minor\nguardian_name\nitem_description · kind\ndetail · request\nresponse_channel\nconformity','green','Campos resumidos')
  d.card(730,300,490,340,'Interface · Constancia','ClaimReceipt','code · created_at\nprovider · details\nreceipt_email_status\nprovider_actions','blue')
  d.card(1380,300,460,340,'Interface · Proveedor','ClaimsProvider','name · ruc · address\nprivacyContact\nprivacyNotice','green')
  d.card(730,760,490,200,'Interface · Bandeja','StoredClaim','id · response_text · response_sent_at','blue')
  d.arrow([[730,480],[582,480]],'details','green')
  d.arrow([[1220,480],[1368,480]],'provider','green')
  d.arrow([[975,760],[975,652]],'extends','blue',false,[1065,710])
}
{
  const d=make('nivel4-dependencias','C4 · Nivel 4 · Código','Funciones que registran la reclamación','Del formulario al servidor, con validación compartida y correo posterior a la persistencia.','Solo las conexiones etiquetadas HTTP cruzan un límite remoto; las restantes representan imports o llamadas.')
  d.card(80,300,400,250,'Navegador','ClaimsPage','Interacción y validación\nConserva submission_key','green')
  d.card(650,300,520,250,'Servicio del cliente','submitClaim','claims.service.ts\nPOST JSON de la hoja','green')
  d.card(1360,300,480,250,'Handler del servidor','api/claims','Valida, calcula hash\nInserta o recupera hoja','blue')
  d.arrow([[492,425],[638,425]],'Llamada')
  d.arrow([[1182,425],[1348,425]],'HTTP POST')
  d.card(80,730,450,230,'Reglas comunes','validateClaim','shared/claims.mjs\nNormalización y errores','green')
  d.card(730,730,450,230,'Persistencia','Crypto y SDK','SHA-256 · Supabase\nClave única y datos','blue')
  d.card(1390,730,450,230,'Correo','sendClaimReceipt','claimEmail / claimSheetEntries\nHTTP a Resend y estado SQL','amber')
  d.arrow([[280,550],[280,718]],'','green')
  d.arrow([[1480,550],[1480,640],[305,640],[305,718]],'','green',true)
  d.arrow([[1600,550],[1600,680],[955,680],[955,718]],'','blue')
  d.arrow([[1710,550],[1710,718]],'','amber')
}
sequence('nivel4-secuencia','C4 · Nivel 4 · Secuencia','Registrar, recuperar y conservar la hoja','Un reintento con la misma clave y los mismos datos recupera la constancia original.',[
  ['green','PERSONA','Consumidor'],['green','NAVEGADOR','ClaimsPage'],['blue','SERVIDOR','api/claims'],['green','DATOS','consumer_claims'],['blue','HELPER','Correo'],['amber','PROVEEDOR','Resend'],
],[
  [0,1,'Confirmar formulario y conformidad'],[1,2,'POST JSON + submission_key'],
  [2,2,'Comprobar configuración; validar datos y calcular hash'],[2,3,'INSERT con clave de envío única'],
  [3,2,'Alta nueva o conflicto de unicidad','green',true],[2,3,'Si duplicada: recuperar por la misma clave'],
  [3,2,'Hoja existente y payload_hash','green',true],[2,2,'Hash distinto: 409 y terminar; igual: continuar'],
  [2,4,'Solicitar copia cuando corresponde'],[4,5,'HTTP: correo con clave de idempotencia'],
  [5,4,'Aceptación o error del proveedor','amber',true],[4,3,'Actualizar aceptación si el proveedor acepta'],
  [4,2,'sent o pending: la hoja se conserva','amber',true],[2,1,'201: constancia nueva o recuperada','blue',true],
  [1,0,'Hoja imprimible y estado veraz','green',true],
],'Si no se indicó correo: not_requested. Si ya figura sent, el helper no vuelve a enviarla.',['Fallo de correo ≠ fallo de registro. La aceptación del proveedor no garantiza entrega ni lectura.'])

// Exportación con el mismo motor tipográfico del navegador.
await fs.mkdir(out,{recursive:true})
const browser=spawn(process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+path.join(process.env.TEMP??out,'totorilla-diagram-export'),'about:blank'],{stdio:['ignore','ignore','pipe']})
let ws
try {
  const url=await new Promise((resolve,reject)=>{let text='';browser.once('error',reject);browser.stderr.on('data',data=>{text+=data;const m=text.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m)resolve(m[1])})})
  ws=new WebSocket(url);await new Promise(resolve=>ws.addEventListener('open',resolve,{once:true}))
  let id=0;const pending=new Map()
  ws.addEventListener('message',({data})=>{const r=JSON.parse(data);if(!r.id)return;const p=pending.get(r.id);pending.delete(r.id);r.error?p.reject(new Error(JSON.stringify(r.error))):p.resolve(r.result)})
  const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))})
  const {targetId}=await call('Target.createTarget',{url:'about:blank'})
  const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true})
  const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},sessionId);if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value}
  for(const d of diagrams){
    const svg=d.svg()
    await fs.writeFile(path.join(out,d.name+'.svg'),svg)
    await call('Emulation.setDeviceMetricsOverride',{width:1920,height:d.height,deviceScaleFactor:1.5,mobile:false},sessionId)
    await evaluate(`document.body.innerHTML=${JSON.stringify(svg)};document.body.style.cssText='margin:0;background:#faf8f1';document.fonts.ready`)
    const errors=await evaluate(`(()=>{const errors=[];for(const el of document.querySelectorAll('text')){const b=el.getBBox();if(b.x<0||b.x+b.width>1910||b.y<0||b.y+b.height>${d.height})errors.push(el.textContent+' outside canvas');const card=el.closest('[data-card]');if(card){const [x,y,w,h]=card.dataset.card.split(',').map(Number);if(b.x<x+12||b.x+b.width>x+w-12||b.y+b.height>y+h-12)errors.push(el.textContent+' outside card')}}return errors})()`)
    if(errors.length)throw new Error(d.name+': '+errors.join('; '))
    const image=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true},sessionId)
    await fs.writeFile(path.join(out,d.name+'.png'),Buffer.from(image.data,'base64'))
    console.log('OK '+d.name+' (2880 × '+Math.round(d.height*1.5)+')')
  }
  console.log('Exported '+diagrams.length+' custom diagrams. Text bounds checked in Chrome.')
  await call('Browser.close')
}finally{ws?.close();browser.kill()}
